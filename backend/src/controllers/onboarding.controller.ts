import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { OnboardingMaterial } from "../entities/OnboardingMaterial";

export const onboardingController = {
    getAll: async (req: Request, res: Response) => {
        try {
            const repository = AppDataSource.getRepository(OnboardingMaterial);
            const materials = await repository.find();
            return res.json(materials);
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    getById: async (req: Request, res: Response) => {
        try {
            const repository = AppDataSource.getRepository(OnboardingMaterial);
            const material = await repository.findOneBy({ id: req.params.materialId as any });
            return res.json(material);
        } catch (error: any) {

            return res.status(500).json({ success: false, message: error.message });
        }
    }
};
