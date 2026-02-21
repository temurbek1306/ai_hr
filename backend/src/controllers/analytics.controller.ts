import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Employee } from "../entities/Employee";
import { TestResult } from "../entities/TestResult";
import { Test } from "../entities/Test";
import { KnowledgeArticle } from "../entities/KnowledgeArticle";

export const analyticsController = {
    getOverview: async (req: Request, res: Response) => {
        try {
            const employeeRepo = AppDataSource.getRepository(Employee);
            const testResultRepo = AppDataSource.getRepository(TestResult);
            const articleRepo = AppDataSource.getRepository(KnowledgeArticle);

            const totalEmployees = await employeeRepo.count();
            const activeEmployees = await employeeRepo.count({ where: { status: "active" } });
            const testsCompleted = await testResultRepo.count({ where: { status: "COMPLETED" } });
            const knowledgeArticles = await articleRepo.count();

            const avgScoreRaw = await testResultRepo
                .createQueryBuilder("tr")
                .select("AVG(tr.score)", "avg")
                .where("tr.status = :status", { status: "COMPLETED" })
                .getRawOne();

            const averageTestScore = avgScoreRaw?.avg
                ? Math.round(parseFloat(avgScoreRaw.avg))
                : 0;

            return res.json({
                totalEmployees,
                activeEmployees,
                completedTests: testsCompleted,
                completedSurveys: 0,
                averageTestScore,
                knowledgeArticles,
                articleViews: knowledgeArticles * 3 // approx
            });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    getExtended: async (req: Request, res: Response) => {
        try {
            const employeeRepo = AppDataSource.getRepository(Employee);
            const testResultRepo = AppDataSource.getRepository(TestResult);

            // Real department stats
            const deptRaw = await employeeRepo
                .createQueryBuilder("e")
                .select("e.department", "name")
                .addSelect("COUNT(e.id)", "count")
                .groupBy("e.department")
                .getRawMany();

            // Real test performance by department
            const testPerformanceRaw = await testResultRepo
                .createQueryBuilder("tr")
                .leftJoin("tr.employee", "emp")
                .select("emp.department", "department")
                .addSelect("AVG(tr.score)", "avgScore")
                .addSelect("COUNT(tr.id)", "count")
                .where("tr.status = :s", { s: "COMPLETED" })
                .groupBy("emp.department")
                .getRawMany();

            // Onboarding status from real data
            const total = await employeeRepo.count();
            const active = await employeeRepo.count({ where: { status: "active" } });
            const inactive = await employeeRepo.count({ where: { status: "inactive" } });

            return res.json({
                departments: deptRaw.map(d => ({
                    name: d.name || "Boshqa",
                    count: parseInt(d.count)
                })),
                onboardingStatus: {
                    completed: active,
                    inProgress: total - active - inactive,
                    pending: inactive
                },
                testPerformance: testPerformanceRaw.map(t => ({
                    department: t.department || "Boshqa",
                    avgScore: Math.round(parseFloat(t.avgScore || "0")),
                    count: parseInt(t.count)
                }))
            });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    getDepartments: async (req: Request, res: Response) => {
        try {
            const employeeRepo = AppDataSource.getRepository(Employee);
            const testResultRepo = AppDataSource.getRepository(TestResult);

            const deptStats = await employeeRepo
                .createQueryBuilder("employee")
                .select("employee.department", "name")
                .addSelect("COUNT(employee.id)", "count")
                .groupBy("employee.department")
                .getRawMany();

            // Get avg score per department
            const deptScores = await testResultRepo
                .createQueryBuilder("tr")
                .leftJoin("tr.employee", "emp")
                .select("emp.department", "department")
                .addSelect("AVG(tr.score)", "avgScore")
                .where("tr.status = :s", { s: "COMPLETED" })
                .groupBy("emp.department")
                .getRawMany();

            const scoreMap: Record<string, number> = {};
            deptScores.forEach(d => {
                scoreMap[d.department || "Boshqa"] = Math.round(parseFloat(d.avgScore || "0"));
            });

            const colors = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];
            return res.json(deptStats.map((d, i) => ({
                name: d.name || "Boshqa",
                count: parseInt(d.count),
                score: scoreMap[d.name || "Boshqa"] || 0,
                color: colors[i % colors.length]
            })));
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    getOnboardingStatus: async (req: Request, res: Response) => {
        try {
            const employeeRepo = AppDataSource.getRepository(Employee);
            const completed = await employeeRepo.count({ where: { status: "active" } });
            const inactive = await employeeRepo.count({ where: { status: "inactive" } });
            const total = await employeeRepo.count();
            const inProgress = total - completed - inactive;

            return res.json({
                completed,
                inProgress: Math.max(0, inProgress),
                pending: inactive
            });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    getEmployeeSummary: async (req: Request, res: Response) => {
        try {
            let { employeeId } = req.params;

            // Handle "me" alias
            if (employeeId === 'me') {
                employeeId = (req as any).user?.id;
            }

            if (!employeeId) {
                return res.status(400).json({ success: false, message: "Xodim ID aniqlanmadi" });
            }

            const testResultRepo = AppDataSource.getRepository(TestResult);
            const results = await testResultRepo.find({
                where: { employee: { id: employeeId as any }, status: "COMPLETED" },
                relations: ["test"]
            });

            return res.json({
                results: results.map(r => ({
                    testTitle: r.test?.title || "Test",
                    score: r.score,
                    passed: r.score >= (r.test?.passingScore || 70),
                    date: r.completedAt || r.createdAt
                }))
            });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};
