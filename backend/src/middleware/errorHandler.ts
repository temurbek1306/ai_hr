import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("!!! GLOBAL ERROR !!!", {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        status: err.status || 500,
        method: req.method,
        url: req.url
    });

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Ichki server xatoligi yuz berdi",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};
