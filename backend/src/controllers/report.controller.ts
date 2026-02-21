import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { TestResult } from "../entities/TestResult";
import { Employee } from "../entities/Employee";
import { KnowledgeArticle } from "../entities/KnowledgeArticle";

export const reportController = {
    getAll: async (req: Request, res: Response) => {
        try {
            const testResultRepo = AppDataSource.getRepository(TestResult);
            const employeeRepo = AppDataSource.getRepository(Employee);
            const articleRepo = AppDataSource.getRepository(KnowledgeArticle);

            const totalEmployees = await employeeRepo.count();
            const totalCompleted = await testResultRepo.count({ where: { status: "COMPLETED" } });
            const avgRaw = await testResultRepo
                .createQueryBuilder("tr")
                .select("AVG(tr.score)", "avg")
                .where("tr.status = :s", { s: "COMPLETED" })
                .getRawOne();
            const avgScore = avgRaw?.avg ? Math.round(parseFloat(avgRaw.avg)) : 0;

            return res.json([
                {
                    id: "1",
                    title: "Oylik HR Hisoboti",
                    type: "monthly",
                    status: "ready",
                    generatedAt: new Date().toISOString(),
                    data: { totalEmployees, completedTests: totalCompleted, avgScore }
                }
            ]);
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    generate: async (req: Request, res: Response) => {
        try {
            const { type } = req.body;
            return res.json({
                id: Date.now().toString(),
                title: `${type || "Umumiy"} hisobot`,
                type: type?.toLowerCase() || "general",
                status: "ready",
                generatedAt: new Date().toISOString()
            });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    download: async (req: Request, res: Response) => {
        try {
            const employeeRepo = AppDataSource.getRepository(Employee);
            const employees = await employeeRepo.find({ take: 100 });
            const csvRows = ["id,fullName,email,position,department,status,startDate"];
            employees.forEach(e => {
                const fullName = `${e.firstName} ${e.lastName}`.trim();
                csvRows.push(`${e.id},${fullName},${e.email},${e.position || ""},${e.department || ""},${e.status},${e.startDate || ""}`);
            });
            res.setHeader("Content-Type", "text/csv");
            res.setHeader("Content-Disposition", "attachment; filename=employees.csv");
            return res.send(csvRows.join("\n"));
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    getTestsReport: async (req: Request, res: Response) => {
        try {
            const testResultRepo = AppDataSource.getRepository(TestResult);
            const total = await testResultRepo.count();
            const completed = await testResultRepo.count({ where: { status: "COMPLETED" } });
            const avgRaw = await testResultRepo
                .createQueryBuilder("tr")
                .select("AVG(tr.score)", "avg")
                .where("tr.status = :s", { s: "COMPLETED" })
                .getRawOne();
            const avgScore = avgRaw?.avg ? Math.round(parseFloat(avgRaw.avg)) : 0;

            const passedRaw = await testResultRepo
                .createQueryBuilder("tr")
                .select("COUNT(*)", "cnt")
                .where("tr.status = :s AND tr.score >= 70", { s: "COMPLETED" })
                .getRawOne();
            const passed = parseInt(passedRaw?.cnt) || 0;
            const passRate = completed > 0 ? Math.round((passed / completed) * 100) : 0;

            return res.json({
                totalTests: total,
                completedTests: completed,
                averageScore: avgScore,
                passRate,
                byTest: []
            });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    getEmployeeReport: async (req: Request, res: Response) => {
        try {
            const employeeRepo = AppDataSource.getRepository(Employee);
            const total = await employeeRepo.count();
            const active = await employeeRepo.count({ where: { status: "active" } });

            // Department breakdown
            const byDept = await employeeRepo
                .createQueryBuilder("e")
                .select("e.department", "department")
                .addSelect("COUNT(e.id)", "count")
                .groupBy("e.department")
                .getRawMany();

            return res.json({
                start: req.query.startDate,
                end: req.query.endDate,
                totalEmployees: total,
                newHires: active,
                terminations: total - active,
                byDepartment: byDept.map(d => ({
                    department: d.department || "Boshqa",
                    count: parseInt(d.count)
                }))
            });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};
