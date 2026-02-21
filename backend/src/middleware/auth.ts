import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
        (req as any).user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (user && (user.role === "ROLE_ADMIN" || user.role === "ADMIN")) {
        next();
    } else {
        return res.status(403).json({ success: false, message: "Admin access required" });
    }
};
