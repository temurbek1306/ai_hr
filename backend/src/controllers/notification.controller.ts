import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Notification } from "../entities/Notification";

export const notificationController = {
    getAll: async (req: Request, res: Response) => {
        try {
            const user = (req as any).user;
            const repository = AppDataSource.getRepository(Notification);
            const notifications = await repository.find({
                where: { user: { id: user.id } },
                order: { createdAt: "DESC" }
            });
            return res.json({ success: true, body: notifications });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    markRead: async (req: Request, res: Response) => {
        try {
            const repository = AppDataSource.getRepository(Notification);
            await repository.update(req.params.id, { read: true });
            return res.json({ success: true, message: "Marked as read" });

        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};
