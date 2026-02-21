import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { KnowledgeArticle } from "../entities/KnowledgeArticle";

export const articleController = {
    getAll: async (req: Request, res: Response) => {
        try {
            const repository = AppDataSource.getRepository(KnowledgeArticle);
            const articles = await repository.find();
            // Important: Frontend KnowledgeService.getArticles expects a raw array or .body
            // Based on knowledge.service.ts line 47: return Array.isArray(response.data) ? response.data : ((response.data as any).body || []);
            // So we can return either. Let's return the array directly to be safe as per Swagger note in service.
            return res.json(articles);
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    getById: async (req: Request, res: Response) => {
        try {
            const repository = AppDataSource.getRepository(KnowledgeArticle);
            const article = await repository.findOneBy({ id: req.params.id as any });
            if (!article) return res.status(404).json({ success: false, message: "Maqola topilmadi" });
            return res.json(article);
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    create: async (req: Request, res: Response) => {
        try {
            const { title, content, type, mediaUrl } = req.body;
            const repository = AppDataSource.getRepository(KnowledgeArticle);
            const article = repository.create({ title, content, type, mediaUrl });
            await repository.save(article);
            return res.json(article);
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};
