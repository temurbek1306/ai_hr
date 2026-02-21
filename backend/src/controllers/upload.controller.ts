import { Request, Response } from "express";

export const uploadController = {
    uploadFile: async (req: Request, res: Response) => {
        return res.json({ success: true, body: { url: "http://localhost:8000/uploads/placeholder.png" } });
    }
};

export const feedbackController = {
    submit: async (req: Request, res: Response) => {
        return res.json({ success: true, message: "Feedback received" });
    }
};
