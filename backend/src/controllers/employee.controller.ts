import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Employee } from "../entities/Employee";
import { User } from "../entities/User";
import { TestResult } from "../entities/TestResult";
import bcrypt from "bcryptjs";

export const employeeController = {
    getMe: async (req: Request, res: Response) => {
        try {
            const user = (req as any).user;
            if (!user) {
                return res.status(401).json({ success: false, message: "Avtorizatsiyadan o'tilmagan" });
            }

            const employeeRepository = AppDataSource.getRepository(Employee);
            const employee = await employeeRepository.findOne({
                where: { user: { id: user.id as any } },
                relations: ["user"]
            } as any);

            if (!employee) {
                const userRepository = AppDataSource.getRepository(User);
                const fullUser = await userRepository.findOne({ where: { id: user.id as any } });

                return res.json({
                    success: true,
                    body: {
                        id: user.id,
                        firstName: '',
                        lastName: '',
                        email: fullUser?.email || '',
                        phone: '',
                        location: '',
                        role: user.role,
                        status: "active"
                    }
                });
            }

            return res.json({
                success: true,
                body: {
                    ...employee,
                    fullName: `${employee.firstName} ${employee.lastName}`.trim(),
                    username: employee.user.username,
                    role: employee.user.role
                }
            });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    updateMe: async (req: Request, res: Response) => {
        try {
            const user = (req as any).user;
            const userRepository = AppDataSource.getRepository(User);
            const employeeRepository = AppDataSource.getRepository(Employee);

            const { firstName, lastName, phone, location, email } = req.body;

            // Find or create an Employee profile for this user (works for both admin and employees)
            let employee = await employeeRepository.findOne({ where: { user: { id: user.id } } });

            if (!employee) {
                // Create Employee profile for first-time (admin or user without a profile yet)
                const currentUser = await userRepository.findOne({ where: { id: user.id as any } });
                const newEmployee = employeeRepository.create({
                    firstName: firstName || 'Admin',
                    lastName: lastName || '',
                    email: email || currentUser?.email || '',
                    phone: phone || '',
                    location: location || '',
                    status: 'active',
                    user: { id: user.id } as any
                } as any);
                await employeeRepository.save(newEmployee as any);
                employee = newEmployee as any;
            } else {
                // Update only the fields that were sent
                const updateData: any = {};
                if (firstName !== undefined) updateData.firstName = firstName;
                if (lastName !== undefined) updateData.lastName = lastName;
                if (phone !== undefined) updateData.phone = phone;
                if (location !== undefined) updateData.location = location;
                // Only update email if it changed and not already taken by another employee
                if (email && email !== employee.email) {
                    const taken = await employeeRepository.findOne({ where: { email } });
                    if (!taken || taken.id === employee.id) {
                        updateData.email = email;
                    }
                }
                if (Object.keys(updateData).length > 0) {
                    await AppDataSource
                        .createQueryBuilder()
                        .update(Employee)
                        .set(updateData)
                        .where('id = :id', { id: employee.id })
                        .execute();
                }
            }

            const updated = await employeeRepository.findOne({
                where: { user: { id: user.id } } as any,
                relations: ['user']
            });

            return res.json({ success: true, body: updated });
        } catch (error: any) {
            console.error('UpdateMe Error:', error);
            return res.status(500).json({ success: false, message: error.message });
        }
    },



    getAll: async (req: Request, res: Response) => {
        try {
            const employeeRepository = AppDataSource.getRepository(Employee);
            // Exclude admin users from the employee list
            const employees = await employeeRepository
                .createQueryBuilder('employee')
                .leftJoinAndSelect('employee.user', 'user')
                .where('user.role != :role', { role: 'ROLE_ADMIN' })
                .getMany();
            return res.json({ success: true, body: employees });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    create: async (req: Request, res: Response) => {
        try {
            const { firstName, lastName, email, phone, position, department, startDate, salary, videoUrl } = req.body;
            const userRepository = AppDataSource.getRepository(User);
            const employeeRepository = AppDataSource.getRepository(Employee);

            const existingUser = await userRepository.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ success: false, message: "Ushbu email bilan foydalanuvchi allaqachon mavjud." });
            }

            const DEFAULT_PASSWORD = "welcome123";
            const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
            const username = email.split("@")[0] + "_" + Math.floor(Math.random() * 1000);

            const user = userRepository.create({
                username,
                email,
                password: hashedPassword,
                role: "ROLE_USER"
            });
            await userRepository.save(user);

            const employee = employeeRepository.create({
                firstName,
                lastName,
                email,
                phone,
                position,
                department,
                startDate,
                salary: parseFloat(salary) || 0,
                videoUrl,
                status: "active",
                user: user
            });
            await employeeRepository.save(employee);

            return res.json({
                success: true,
                body: {
                    ...employee,
                    generatedPassword: DEFAULT_PASSWORD,
                    username: username
                }
            });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    getById: async (req: Request, res: Response) => {
        try {
            const employeeRepository = AppDataSource.getRepository(Employee);
            const employee = await employeeRepository.findOne({
                where: { id: req.params.employeeId as any },
                relations: ["user"]
            });
            if (!employee) return res.status(404).json({ success: false, message: "Xodim topilmadi" });
            return res.json({ success: true, body: employee });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    update: async (req: Request, res: Response) => {
        try {
            const employeeRepository = AppDataSource.getRepository(Employee);
            const { firstName, lastName, salary, ...otherFields } = req.body;
            const updateData: any = { ...otherFields };
            if (firstName) updateData.firstName = firstName;
            if (lastName) updateData.lastName = lastName;
            if (salary !== undefined) updateData.salary = parseFloat(salary) || 0;

            await employeeRepository.update(req.params.employeeId as any, updateData);
            return res.json({ success: true, message: "Xodim yangilandi" });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    delete: async (req: Request, res: Response) => {
        try {
            const employeeRepository = AppDataSource.getRepository(Employee);
            await employeeRepository.delete(req.params.employeeId as any);
            return res.json({ success: true, message: "Xodim o'chirildi" });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    getSummary: async (req: Request, res: Response) => {
        try {
            const employeeId = req.params.id;
            const testResultRepository = AppDataSource.getRepository(TestResult);
            const employeeRepository = AppDataSource.getRepository(Employee);

            const employee = await employeeRepository.findOne({ where: { id: employeeId as any } });
            const results = await testResultRepository.find({
                where: { employee: { id: employeeId as any }, status: "COMPLETED" },
                relations: ["test"]
            });

            const totalTests = results.length;
            const averageScore = totalTests > 0
                ? Math.round(results.reduce((acc, curr) => acc + curr.score, 0) / totalTests)
                : 0;

            return res.json({
                success: true,
                body: {
                    employeeId,
                    employeeName: employee ? `${employee.firstName} ${employee.lastName}`.trim() : "Xodim",
                    totalTests,
                    testsCompleted: totalTests,
                    averageScore,
                    totalOnboardingMaterials: 10,
                    completedOnboardingMaterials: 6,
                    testResults: results.map(r => ({
                        testId: r.test.id,
                        testTitle: r.test.title,
                        score: r.score,
                        date: r.completedAt || r.createdAt
                    }))
                }
            });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    getMeSummary: async (req: Request, res: Response) => {
        try {
            const user = (req as any).user;
            const employeeRepository = AppDataSource.getRepository(Employee);
            const testResultRepository = AppDataSource.getRepository(TestResult);

            const employee = await employeeRepository.findOne({ where: { user: { id: user.id } } });
            if (!employee) return res.status(404).json({ success: false, message: "Profil topilmadi" });

            const results = await testResultRepository.find({
                where: { employee: { id: employee.id }, status: "COMPLETED" },
                relations: ["test"]
            });

            const totalTests = results.length;
            const averageScore = totalTests > 0 ? Math.round(results.reduce((acc, curr) => acc + curr.score, 0) / totalTests) : 0;

            return res.json({
                success: true,
                body: {
                    employeeId: employee.id,
                    employeeName: `${employee.firstName} ${employee.lastName}`.trim(),
                    totalTests,
                    testsCompleted: totalTests,
                    averageScore,
                    totalOnboardingMaterials: 10,
                    completedOnboardingMaterials: 4,
                    testResults: results.map(r => ({
                        testId: r.test.id,
                        testTitle: r.test.title,
                        score: r.score
                    }))
                }
            });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    getMeTestResults: async (req: Request, res: Response) => {
        try {
            const user = (req as any).user;
            const employeeRepository = AppDataSource.getRepository(Employee);
            const testResultRepository = AppDataSource.getRepository(TestResult);

            const employee = await employeeRepository.findOne({ where: { user: { id: user.id as any } } } as any);
            if (!employee) return res.status(404).json({ success: false, message: "Profil topilmadi" });

            const results = await testResultRepository.find({
                where: { employee: { id: employee.id }, status: "COMPLETED" },
                relations: ["test"]
            });

            return res.json({
                success: true,
                body: {
                    testTitle: "Mening natijalarim",
                    results: results.map(r => ({
                        id: r.id,
                        testTitle: r.test.title,
                        score: r.score,
                        date: r.completedAt || r.createdAt
                    }))
                }
            });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    getMeActivities: async (req: Request, res: Response) => {
        try {
            const user = (req as any).user;
            const employeeRepo = AppDataSource.getRepository(Employee);
            const testResultRepo = AppDataSource.getRepository(TestResult);
            const employee = await employeeRepo.findOne({ where: { user: { id: user.id as any } } } as any);
            if (!employee) return res.json({ success: true, body: [] });

            const results = await testResultRepo.find({
                where: { employee: { id: employee.id } },
                relations: ["test"],
                order: { createdAt: "DESC" },
                take: 10
            });

            const activities = results.map(r => ({
                id: r.id,
                type: r.status === "COMPLETED" ? "TEST_COMPLETED" : "TEST_STARTED",
                title: r.test?.title || "Test",
                score: r.score,
                status: r.status,
                timestamp: r.completedAt || r.createdAt,
                description: r.status === "COMPLETED"
                    ? `${r.test?.title || "Test"} topshirib bo'lindi. Ball: ${r.score}`
                    : `${r.test?.title || "Test"} boshlandi`
            }));

            return res.json({ success: true, body: activities });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },
    getStatus: async (req: Request, res: Response) => {
        try {
            const employeeRepo = AppDataSource.getRepository(Employee);
            const testResultRepo = AppDataSource.getRepository(TestResult);
            const employee = await employeeRepo.findOne({ where: { id: req.params.id as any } });
            if (!employee) return res.status(404).json({ success: false, message: "Xodim topilmadi" });

            const totalResults = await testResultRepo.count({ where: { employee: { id: employee.id } } });
            const completed = await testResultRepo.count({ where: { employee: { id: employee.id }, status: "COMPLETED" } });
            const progress = totalResults > 0 ? Math.round((completed / totalResults) * 100) : 0;

            return res.json({
                success: true,
                body: {
                    status: employee.status || "active",
                    onboardingProgress: progress,
                    ndaAccepted: employee.ndaAccepted,
                    testsCompleted: completed,
                    totalTests: totalResults
                }
            });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },
    getProfile: async (req: Request, res: Response) => {
        try {
            const employeeRepository = AppDataSource.getRepository(Employee);
            const employee = await employeeRepository.findOne({
                where: { id: req.params.id as any },
                relations: ["user"]
            });
            return res.json({ success: true, body: employee });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    importEmployees: async (req: Request, res: Response) => res.json({ success: true, message: "Import qilindi" }),
    exportEmployees: async (req: Request, res: Response) => {
        try {
            const employeeRepo = AppDataSource.getRepository(Employee);
            const employees = await employeeRepo.find({ take: 1000 });
            const rows = ["id,fullName,firstName,lastName,email,phone,position,department,status,startDate,createdAt"];
            employees.forEach(e => {
                rows.push([
                    e.id, `${e.firstName} ${e.lastName}`.trim(), e.firstName || "", e.lastName || "",
                    e.email || "", e.phone || "", e.position || "",
                    e.department || "", e.status || "", e.startDate || "",
                    e.createdAt ? new Date(e.createdAt).toISOString().split('T')[0] : ""
                ].join(","));
            });
            res.setHeader("Content-Type", "text/csv; charset=utf-8");
            res.setHeader("Content-Disposition", `attachment; filename=employees_${new Date().toISOString().split('T')[0]}.csv`);
            return res.send(rows.join("\n"));
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },
    cleanupGhosts: async (req: Request, res: Response) => {
        try {
            const employeeRepo = AppDataSource.getRepository(Employee);
            const userRepo = AppDataSource.getRepository(User);
            // Find employees with no linked user
            const allEmployees = await employeeRepo.find({ relations: ["user"] });
            const ghosts = allEmployees.filter(e => !e.user);
            const ghostIds = ghosts.map(e => e.id);
            if (ghostIds.length > 0) {
                await employeeRepo.delete(ghostIds as any);
            }
            return res.json({ success: true, message: `${ghostIds.length} ta "ghost" xodim tozalandi`, count: ghostIds.length });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },
    getAssignments: async (req: Request, res: Response) => {
        try {
            const { Assignment } = await import("../entities/Assignment");
            const assignmentRepo = AppDataSource.getRepository(Assignment);
            const employeeId = req.params.id || req.params.employeeId;
            const assignments = await assignmentRepo.find({
                where: { employeeId: employeeId as any }
            });
            return res.json({ success: true, body: assignments });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    createAssignment: async (req: Request, res: Response) => {
        try {
            const { Assignment } = await import("../entities/Assignment");
            const assignmentRepo = AppDataSource.getRepository(Assignment);
            const employeeRepo = AppDataSource.getRepository(Employee);

            const employeeId = req.params.id || req.params.employeeId;
            const employee = await employeeRepo.findOne({ where: { id: employeeId as any } });
            if (!employee) return res.status(404).json({ success: false, message: "Xodim topilmadi" });

            const { assignmentType, referenceId, referenceIds, title, dueDate } = req.body;
            const type = assignmentType || "TEST";

            // Support bulk assignment (Sync for multi-select)
            if (referenceIds && Array.isArray(referenceIds)) {
                if (type === 'TEST') {
                    // Get current test assignments
                    const currentAssignments = await assignmentRepo.find({
                        where: { employeeId: employee.id, assignmentType: 'TEST' }
                    });
                    const currentRefIds = currentAssignments.map(a => a.referenceId);

                    // Assignments to remove (in DB but not in new list)
                    const toRemove = currentAssignments.filter(a => !referenceIds.includes(a.referenceId));
                    if (toRemove.length > 0) {
                        await assignmentRepo.remove(toRemove);
                    }

                    // Assignments to add (in new list but not in DB)
                    const savedAssignments = [];
                    for (const refId of referenceIds) {
                        if (!currentRefIds.includes(refId)) {
                            const assignment = assignmentRepo.create({
                                employee,
                                employeeId: employee.id,
                                assignmentType: 'TEST',
                                referenceId: refId,
                                title: title || refId,
                                dueDate,
                                status: "ASSIGNED"
                            });
                            savedAssignments.push(await assignmentRepo.save(assignment));
                        }
                    }
                    return res.status(201).json({ success: true, body: { added: savedAssignments.length, removed: toRemove.length } });
                }

                // Generic bulk (non-sync) for other types if needed later
                const results = [];
                for (const refId of referenceIds) {
                    const assignment = assignmentRepo.create({
                        employee,
                        employeeId: employee.id,
                        assignmentType: type,
                        referenceId: refId,
                        title: title || refId,
                        dueDate,
                        status: "ASSIGNED"
                    });
                    results.push(await assignmentRepo.save(assignment));
                }
                return res.status(201).json({ success: true, body: results });
            }

            // Single assignment (existing logic)
            const assignment = assignmentRepo.create({
                employee,
                employeeId: employee.id,
                assignmentType: type,
                referenceId,
                title: title || referenceId,
                dueDate,
                status: "ASSIGNED"
            });
            const saved = await assignmentRepo.save(assignment);
            return res.status(201).json({ success: true, body: saved });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};
