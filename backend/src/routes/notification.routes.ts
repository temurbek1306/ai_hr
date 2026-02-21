import { Router } from "express";
import { notificationController } from "../controllers/notification.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// =====================
// NOTIFICATION ROUTES
// =====================
router.get("/", authMiddleware, notificationController.getAll);
router.put("/:id/read", authMiddleware, notificationController.markRead);

export default router;
