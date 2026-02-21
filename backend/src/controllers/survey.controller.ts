import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { KnowledgeArticle } from "../entities/KnowledgeArticle";
import { TestResult } from "../entities/TestResult";

// Since there's no Survey entity in DB, we use KnowledgeArticle for content
// and TestResult for analytics
export const surveyController = {
    getSurveys: async (req: Request, res: Response) => {
        // Return empty until survey entity is created, but don't crash
        return res.json({ success: true, body: [] });
    },

    getSurveyById: async (req: Request, res: Response) => {
        return res.status(404).json({ success: false, message: "So'rovnoma topilmadi" });
    },

    submitSurvey: async (req: Request, res: Response) => {
        return res.json({ success: true, message: "So'rovnoma yuborildi" });
    },

    getAnalytics: async (req: Request, res: Response) => {
        try {
            const testResultRepo = AppDataSource.getRepository(TestResult);
            const completed = await testResultRepo.count({ where: { status: "COMPLETED" } });
            const pending = await testResultRepo.count({ where: { status: "PENDING" } });
            return res.json({ success: true, body: { completed, pending } });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};
