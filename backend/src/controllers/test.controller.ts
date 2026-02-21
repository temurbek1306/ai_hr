import { Request, Response } from "express";
import fs from 'fs';
import path from 'path';
import { AppDataSource } from "../data-source";
import { Test } from "../entities/Test";
import { Question } from "../entities/Question";
import { Option } from "../entities/Option";
import { TestResult } from "../entities/TestResult";
import { Employee } from "../entities/Employee";
import { User } from "../entities/User";
import { Assignment } from "../entities/Assignment";

// Safe JSON parse helper
const safeParseAnswers = (raw: string | null | undefined): Record<string, string> => {
    if (!raw) return {};
    try {
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
        return {};
    }
};

export const testController = {
    getTests: async (req: Request, res: Response) => {
        try {
            const user = (req as any).user;
            const testRepository = AppDataSource.getRepository(Test);

            if (user?.role === 'ROLE_ADMIN') {
                const tests = await testRepository.find({
                    relations: ["questions", "questions.options"]
                } as any);
                return res.json({ success: true, body: tests });
            }

            // For regular employees, only show assigned tests
            const employeeRepository = AppDataSource.getRepository(Employee);
            const assignmentRepository = AppDataSource.getRepository(Assignment);

            const employee = await employeeRepository.findOne({
                where: { user: { id: user.id } }
            });

            if (!employee) {
                return res.json({ success: true, body: [] });
            }

            const assignments = await assignmentRepository.find({
                where: {
                    employeeId: employee.id,
                    assignmentType: 'TEST'
                }
            });

            const assignedTestIds = assignments.map(a => a.referenceId);
            if (assignedTestIds.length === 0) {
                return res.json({ success: true, body: [] });
            }

            // Fetch tests that are in the assignments
            const tests = await testRepository.createQueryBuilder("test")
                .leftJoinAndSelect("test.questions", "question")
                .leftJoinAndSelect("question.options", "option")
                .where("test.id IN (:...ids)", { ids: assignedTestIds })
                .getMany();

            return res.json({ success: true, body: tests });
        } catch (error: any) {
            console.error("getTests error:", error);
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // Admin: create test with questions
    createTest: async (req: Request, res: Response) => {
        try {
            const { title, description, duration, passingScore, passScore, videoUrl, questions } = req.body;
            const testRepo = AppDataSource.getRepository(Test);
            const qRepo = AppDataSource.getRepository(Question);
            const oRepo = AppDataSource.getRepository(Option);

            const test = testRepo.create({
                title,
                description,
                duration: Number(duration) || 30,
                passingScore: Number(passingScore || passScore) || 70, // Handle both names
                videoUrl
            });
            await testRepo.save(test);

            if (questions && Array.isArray(questions)) {
                for (const qData of questions) {
                    // Handle both 'text' and 'questionText'
                    const qText = qData.text || qData.questionText;
                    if (!qText) continue;

                    const q = qRepo.create({ text: qText, test });
                    await qRepo.save(q);

                    if (qData.options && Array.isArray(qData.options)) {
                        for (const oData of qData.options) {
                            let text = "";
                            let isCorrect = false;

                            if (typeof oData === 'string') {
                                // Format: ["Option A", "Option B"]
                                text = oData;
                                isCorrect = (qData.correctAnswer === oData);
                            } else {
                                // Format: [{text: "A", isCorrect: true}]
                                text = oData.text;
                                isCorrect = oData.isCorrect === true;
                            }

                            if (!text) continue;

                            const o = oRepo.create({
                                text,
                                isCorrect,
                                question: q
                            });
                            await oRepo.save(o);
                        }
                    }
                }
            }

            const saved = await testRepo.findOne({
                where: { id: test.id as any },
                relations: ["questions", "questions.options"]
            });
            return res.status(201).json({ success: true, body: saved });
        } catch (error: any) {
            console.error("createTest error:", error);
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    startSession: async (req: Request, res: Response) => {
        console.log(`[testController.startSession] Called for testId: ${req.params.testId}`);
        try {
            const { testId } = req.params;
            const user = (req as any).user;

            const logPath = path.join(process.cwd(), 'backend_error.log');
            fs.appendFileSync(logPath, `\n[${new Date().toISOString()}] Attempting to start test ${testId} for user ${JSON.stringify(user)}\n`);

            const testRepository = AppDataSource.getRepository(Test);
            const testResultRepository = AppDataSource.getRepository(TestResult);
            const employeeRepository = AppDataSource.getRepository(Employee);
            const userRepository = AppDataSource.getRepository(User);

            // 1. Fetch the test with all relations
            const test = await testRepository.findOne({
                where: { id: testId as any },
                relations: ["questions", "questions.options"]
            } as any);

            if (!test) {
                return res.status(404).json({ success: false, message: "Test topilmadi" });
            }

            // 2. Get or auto-create employee profile
            let employee = await employeeRepository.findOne({
                where: { user: { id: user.id } }
            });

            if (!employee) {
                const fullUser = await userRepository.findOne({ where: { id: user.id as any } });
                if (!fullUser) {
                    return res.status(401).json({ success: false, message: "Foydalanuvchi topilmadi" });
                }
                employee = employeeRepository.create({
                    firstName: fullUser.username || "Foydalanuvchi",
                    lastName: "",
                    email: fullUser.email || `${fullUser.username}@hr.local`,
                    status: "active",
                    user: fullUser
                });
                await employeeRepository.save(employee);
                console.log(`✅ Auto-created employee profile for: ${fullUser.username}`);
            }

            // 3. Create session with explicit answersJson = "{}"
            const session = testResultRepository.create({
                test,
                employee,
                status: "PENDING",
                answersJson: "{}",
                score: 0,
                totalQuestions: test.questions ? test.questions.length : 0
            });
            await testResultRepository.save(session);

            // 4. Return test data — NEVER send isCorrect to client
            const questionsForClient = (test.questions || []).map(q => ({
                id: q.id,
                text: q.text,
                options: (q.options || []).map(o => ({
                    id: o.id,
                    text: o.text
                }))
            }));

            console.log(`✅ Test session started: ${session.id} for employee: ${employee.firstName} ${employee.lastName}`);

            return res.json({
                success: true,
                body: {
                    sessionId: session.id,
                    id: test.id,
                    title: test.title,
                    description: test.description,
                    videoUrl: test.videoUrl,
                    duration: (test.duration || 30) * 60, // minutes to seconds
                    passingScore: test.passingScore || 70,
                    questions: questionsForClient
                }
            });
        } catch (error: any) {
            const logPath = path.join(process.cwd(), 'backend_error.log');
            fs.appendFileSync(logPath, `\n[${new Date().toISOString()}] startSession error: ${error?.message}\n${error?.stack}\n`);
            console.error("startSession error:", error?.message, error?.stack);
            return res.status(500).json({
                success: false,
                message: error?.message || "Test sessiyasini boshlashda xatolik yuz berdi"
            });
        }
    },

    submitAnswer: async (req: Request, res: Response) => {
        try {
            const { sessionId } = req.params;
            const { questionId, selectedOptionId, answer } = req.body;
            const testResultRepository = AppDataSource.getRepository(TestResult);

            const result = await testResultRepository.findOne({
                where: { id: sessionId as any }
            });
            if (!result) {
                return res.status(404).json({ success: false, message: "Sessiya topilmadi" });
            }

            // Safely update answersJson
            const currentAnswers = safeParseAnswers(result.answersJson);
            const optionId = selectedOptionId || answer;
            if (questionId && optionId) {
                currentAnswers[questionId] = optionId;
            }
            result.answersJson = JSON.stringify(currentAnswers);

            await testResultRepository.save(result);
            return res.json({ success: true, message: "Javob saqlandi" });
        } catch (error: any) {
            console.error("submitAnswer error:", error?.message);
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    submitAllAnswers: async (req: Request, res: Response) => {
        try {
            const { sessionId } = req.params;
            const { answers } = req.body; // Map of { questionId: selectedOptionId }
            const testResultRepository = AppDataSource.getRepository(TestResult);

            const result = await testResultRepository.findOne({
                where: { id: sessionId as any }
            });
            if (!result) {
                return res.status(404).json({ success: false, message: "Sessiya topilmadi" });
            }

            if (answers && typeof answers === 'object') {
                const currentAnswers = safeParseAnswers(result.answersJson);
                const updatedAnswers = { ...currentAnswers, ...answers };
                result.answersJson = JSON.stringify(updatedAnswers);
                await testResultRepository.save(result);
            }

            return res.json({ success: true, message: "Barcha javoblar saqlandi" });
        } catch (error: any) {
            console.error("submitAllAnswers error:", error?.message);
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    finishSession: async (req: Request, res: Response) => {
        try {
            const { sessionId } = req.params;
            const testResultRepository = AppDataSource.getRepository(TestResult);

            const result = await testResultRepository.findOne({
                where: { id: sessionId as any },
                relations: ["test", "test.questions", "test.questions.options"]
            });

            if (!result) {
                return res.status(404).json({ success: false, message: "Sessiya topilmadi" });
            }

            const answers = safeParseAnswers(result.answersJson);
            let correctCount = 0;

            for (const question of (result.test?.questions || [])) {
                const submittedId = answers[question.id];
                const correct = (question.options || []).find((o: any) => o.isCorrect);
                if (correct && submittedId === correct.id) {
                    correctCount++;
                }
            }

            const total = result.test?.questions?.length || 0;
            const score = total > 0 ? Math.round((correctCount / total) * 100) : 0;
            const passingScore = result.test?.passingScore || 70;

            result.score = score;
            result.correctAnswers = correctCount;
            result.totalQuestions = total;
            result.status = "COMPLETED";
            result.completedAt = new Date();

            await testResultRepository.save(result);

            return res.json({
                success: true,
                body: {
                    score,
                    correctAnswers: correctCount,
                    totalQuestions: total,
                    passed: score >= passingScore,
                    passingScore
                }
            });
        } catch (error: any) {
            console.error("finishSession error:", error?.message);
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    getResults: async (req: Request, res: Response) => {
        try {
            const { testId } = req.params;
            const user = (req as any).user;
            const testResultRepository = AppDataSource.getRepository(TestResult);
            const employeeRepository = AppDataSource.getRepository(Employee);
            const testRepository = AppDataSource.getRepository(Test);

            const employee = await employeeRepository.findOne({
                where: { user: { id: user.id } }
            });

            if (!employee) {
                return res.json({ success: true, body: { testTitle: "", results: [] } });
            }

            const test = await testRepository.findOne({ where: { id: testId as any } });

            const results = await testResultRepository.find({
                where: {
                    test: { id: testId as any },
                    employee: { id: employee.id },
                    status: "COMPLETED"
                },
                order: { completedAt: "DESC" }
            });

            return res.json({
                success: true,
                body: {
                    testTitle: test?.title || "Noma'lum test",
                    results: results.map(r => ({
                        id: r.id,
                        testTitle: test?.title,
                        score: r.score,
                        correctAnswers: r.correctAnswers,
                        totalQuestions: r.totalQuestions,
                        completedAt: r.completedAt,
                        passed: r.score >= (test?.passingScore || 60)
                    }))
                }
            });
        } catch (error: any) {
            console.error("getResults error:", error?.message);
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    getTestById: async (req: Request, res: Response) => {
        try {
            const { testId } = req.params;
            const testRepo = AppDataSource.getRepository(Test);
            const test = await testRepo.findOne({
                where: { id: testId as any },
                relations: ["questions", "questions.options"]
            });

            if (!test) {
                return res.status(404).json({ success: false, message: "Test topilmadi" });
            }

            return res.json({ success: true, body: test });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    updateTest: async (req: Request, res: Response) => {
        try {
            const { testId } = req.params;
            const { title, description, duration, passingScore, passScore, videoUrl, questions } = req.body;
            const testRepo = AppDataSource.getRepository(Test);
            const qRepo = AppDataSource.getRepository(Question);
            const oRepo = AppDataSource.getRepository(Option);

            let test = await testRepo.findOne({ where: { id: testId as any } });
            if (!test) {
                return res.status(404).json({ success: false, message: "Test topilmadi" });
            }

            test.title = title || test.title;
            test.description = description || test.description;
            test.duration = Number(duration) || test.duration;
            test.passingScore = Number(passingScore || passScore) || test.passingScore;
            test.videoUrl = videoUrl !== undefined ? videoUrl : test.videoUrl;
            await testRepo.save(test);

            if (questions && Array.isArray(questions)) {
                // Delete existing questions/options before recreating
                const existingQs = await qRepo.find({ where: { test: { id: testId as any } } });
                for (const q of existingQs) {
                    await oRepo.delete({ question: { id: q.id } });
                    await qRepo.delete(q.id);
                }

                for (const qData of questions) {
                    // Handle both 'text' and 'questionText'
                    const qText = qData.text || qData.questionText;
                    if (!qText) continue;

                    const q = qRepo.create({ text: qText, test });
                    await qRepo.save(q);

                    if (qData.options && Array.isArray(qData.options)) {
                        for (const oData of qData.options) {
                            let text = "";
                            let isCorrect = false;

                            if (typeof oData === 'string') {
                                text = oData;
                                isCorrect = (qData.correctAnswer === oData);
                            } else {
                                text = oData.text;
                                isCorrect = oData.isCorrect === true;
                            }

                            if (!text) continue;

                            const o = oRepo.create({
                                text,
                                isCorrect,
                                question: q
                            });
                            await oRepo.save(o);
                        }
                    }
                }
            }

            const saved = await testRepo.findOne({
                where: { id: testId as any },
                relations: ["questions", "questions.options"]
            });
            return res.json({ success: true, body: saved });
        } catch (error: any) {
            console.error("updateTest error:", error);
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    deleteTest: async (req: Request, res: Response) => {
        try {
            const { testId } = req.params;
            const testRepo = AppDataSource.getRepository(Test);
            const test = await testRepo.findOne({ where: { id: testId as any } });
            if (!test) {
                return res.status(404).json({ success: false, message: "Test topilmadi" });
            }

            await testRepo.remove(test);
            return res.json({ success: true, message: "Test o'chirildi" });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    getForTake: async (req: Request, res: Response) => {
        try {
            const { testId } = req.params;
            const testRepo = AppDataSource.getRepository(Test);
            const test = await testRepo.findOne({
                where: { id: testId as any },
                relations: ["questions", "questions.options"]
            });

            if (!test) {
                return res.status(404).json({ success: false, message: "Test topilmadi" });
            }

            // Remove isCorrect from options for security
            if (test.questions) {
                test.questions.forEach(q => {
                    if (q.options) {
                        q.options.forEach(o => {
                            delete (o as any).isCorrect;
                        });
                    }
                });
            }

            return res.json({ success: true, body: test });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};
