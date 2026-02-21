import { Request, Response } from "express";

export const ndaController = {
    getCurrent: async (req: Request, res: Response) => {
        return res.json({
            success: true,
            body: {
                content: "Bu yerda maxfiylik kelishuvi matni bo'ladi. Xodimlar ushbu hujjatni o'qib tasdiqlashlari shart.",
                version: "1.0",
                updatedAt: new Date().toISOString()
            }
        });
    },
    accept: async (req: Request, res: Response) => {
        return res.json({ success: true, message: "NDA accepted successfully" });
    }
};

export const permissionController = {
    getAll: async (req: Request, res: Response) => {
        return res.json([
            { role: "ROLE_ADMIN", permissions: { all: true } },
            { role: "ROLE_USER", permissions: { read: true } }
        ]);
    },
    update: async (req: Request, res: Response) => {
        return res.json({ success: true, role: req.params.role, permissions: req.body });
    }
};
