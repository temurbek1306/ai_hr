import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { SurveyTrigger } from "../entities/SurveyTrigger";

export const surveyTriggerController = {
    getAll: async (req: Request, res: Response) => {
        try {
            const repository = AppDataSource.getRepository(SurveyTrigger);
            const triggers = await repository.find({ order: { createdAt: "DESC" } });
            return res.json({ success: true, body: triggers });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    create: async (req: Request, res: Response) => {
        try {
            const { name, event, surveyName } = req.body;
            const repository = AppDataSource.getRepository(SurveyTrigger);
            const trigger = repository.create({ name, event, surveyName });
            await repository.save(trigger);
            return res.json({ success: true, body: trigger });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    toggleStatus: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const repository = AppDataSource.getRepository(SurveyTrigger);
            const trigger = await repository.findOneBy({ id: id as string });
            if (!trigger) return res.status(404).json({ success: false, message: "Trigger topilmadi" });

            trigger.status = trigger.status === "active" ? "paused" : "active";
            await repository.save(trigger);
            return res.json({ success: true, body: trigger });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    delete: async (req: Request, res: Response) => {
        try {
            const repository = AppDataSource.getRepository(SurveyTrigger);
            await repository.delete(req.params.id);
            return res.json({ success: true, message: "Trigger o'chirildi" });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};
