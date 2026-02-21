import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Employee } from "../entities/Employee";
import { TestResult } from "../entities/TestResult";

export const dashboardController = {
    getDashboard: async (req: Request, res: Response) => {
        try {
            const employeeRepository = AppDataSource.getRepository(Employee);
            const testResultRepository = AppDataSource.getRepository(TestResult);

            // Count only non-admin employees
            const totalEmployees = await employeeRepository
                .createQueryBuilder('e')
                .leftJoin('e.user', 'u')
                .where('u.role != :role', { role: 'ROLE_ADMIN' })
                .getCount();
            const testsCompleted = await testResultRepository.count({ where: { status: "COMPLETED" } });

            // Fetch department stats (exclude admin)
            const deptStats = await employeeRepository
                .createQueryBuilder("employee")
                .leftJoin('employee.user', 'u')
                .select("employee.department", "department")
                .addSelect("COUNT(employee.id)", "count")
                .where('u.role != :role', { role: 'ROLE_ADMIN' })
                .groupBy("employee.department")
                .getRawMany();

            const avgScoreRaw = await testResultRepository
                .createQueryBuilder("tr")
                .select("AVG(tr.score)", "avg")
                .where("tr.status = :status", { status: "COMPLETED" })
                .getRawOne();

            const avgScore = avgScoreRaw && avgScoreRaw.avg ? Math.round(parseFloat(avgScoreRaw.avg)) : 0;
            const ndaAcceptedCount = await employeeRepository
                .createQueryBuilder('e')
                .leftJoin('e.user', 'u')
                .where('u.role != :role AND e.ndaAccepted = :nda', { role: 'ROLE_ADMIN', nda: true })
                .getCount();

            const data = {
                success: true,
                body: {
                    totalEmployees,
                    ndaAcceptedEmployees: ndaAcceptedCount,
                    onboardingCompletedEmployees: 0,
                    testsCompleted,
                    surveyResponses: 0,
                    summary: {
                        totalEmployees,
                        activeOnboarding: totalEmployees,
                        completionRate: totalEmployees > 0 ? Math.round((ndaAcceptedCount / totalEmployees) * 100) : 0,
                        avgTestScore: avgScore
                    },
                    onboardingChart: [
                        { date: new Date().toISOString().split('T')[0], value: totalEmployees }
                    ],
                    departmentStats: deptStats.map(d => ({
                        department: d.department || "Boshqa",
                        count: parseInt(d.count)
                    }))
                }
            };
            return res.json(data);
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    getSummary: async (req: Request, res: Response) => {
        try {
            const employeeRepository = AppDataSource.getRepository(Employee);
            const testResultRepository = AppDataSource.getRepository(TestResult);

            // Count only non-admin employees
            const total = await employeeRepository
                .createQueryBuilder('e')
                .leftJoin('e.user', 'u')
                .where('u.role != :role', { role: 'ROLE_ADMIN' })
                .getCount();
            const active = await employeeRepository
                .createQueryBuilder('e')
                .leftJoin('e.user', 'u')
                .where('u.role != :role AND e.status = :status', { role: 'ROLE_ADMIN', status: 'active' })
                .getCount();
            const onLeave = await employeeRepository
                .createQueryBuilder('e')
                .leftJoin('e.user', 'u')
                .where('u.role != :role AND e.status = :status', { role: 'ROLE_ADMIN', status: 'on-leave' })
                .getCount();

            // Compute real average test score
            const avgRaw = await testResultRepository
                .createQueryBuilder("tr")
                .select("AVG(tr.score)", "avg")
                .where("tr.status = :status", { status: "COMPLETED" })
                .getRawOne();
            const avgTestScore = avgRaw?.avg ? Math.round(parseFloat(avgRaw.avg)) : 0;

            // Completion rate = employees who passed at least 1 test / total
            const passedCount = await testResultRepository
                .createQueryBuilder("tr")
                .select("COUNT(DISTINCT tr.employeeId)", "cnt")
                .where("tr.status = :status AND tr.score >= 70", { status: "COMPLETED" })
                .getRawOne();
            const completionRate = total > 0
                ? Math.round(((parseInt(passedCount?.cnt) || 0) / total) * 100)
                : 0;

            return res.json({
                success: true,
                body: {
                    totalEmployees: total,
                    activeEmployees: active,
                    onLeave,
                    newThisMonth: total,
                    chartData: [
                        { date: new Date().toISOString().split('T')[0], count: total }
                    ],
                    activeOnboarding: active,
                    completionRate,
                    avgTestScore
                }
            });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    getExtendedStats: async (req: Request, res: Response) => {
        try {
            const testResultRepository = AppDataSource.getRepository(TestResult);

            const totalCompleted = await testResultRepository.count({ where: { status: "COMPLETED" } });

            // Count passed (score >= passingScore, use 70 as default)
            const passedRaw = await testResultRepository
                .createQueryBuilder("tr")
                .select("COUNT(*)", "cnt")
                .where("tr.status = :status AND tr.score >= 70", { status: "COMPLETED" })
                .getRawOne();
            const passed = parseInt(passedRaw?.cnt) || 0;

            return res.json({
                success: true,
                body: {
                    successfulPreTests: passed,
                    successfulPostTests: 0,
                    completedOnboardings: totalCompleted,
                    qualificationImprovements: passed,
                    completedSurveys: 0
                }
            });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    getActivities: async (req: Request, res: Response) => {
        try {
            const employeeRepository = AppDataSource.getRepository(Employee);
            const recentEmployees = await employeeRepository
                .createQueryBuilder('employee')
                .leftJoinAndSelect('employee.user', 'user')
                .where('user.role != :role', { role: 'ROLE_ADMIN' })
                .orderBy('employee.createdAt', 'DESC')
                .take(5)
                .getMany();

            const activities = recentEmployees.map(emp => {
                const fullName = `${emp.firstName} ${emp.lastName}`.trim();
                return {
                    id: emp.id,
                    type: "CREATE",
                    user: "Admin",
                    employeeName: fullName,
                    action: "Yangi xodim qo'shildi",
                    timestamp: emp.createdAt,
                    time: emp.createdAt.toLocaleTimeString(),
                    details: `${fullName} tizimga muvaffaqiyatli qo'shildi`
                };
            });

            return res.json({
                success: true,
                body: activities
            });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};
