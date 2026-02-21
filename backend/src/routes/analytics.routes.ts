import { Router } from "express";
import { analyticsController } from "../controllers/analytics.controller";
import { authMiddleware, adminMiddleware } from "../middleware/auth";

const router = Router();

// =====================
// ANALYTICS ROUTES
// =====================
router.get("/overview", authMiddleware, analyticsController.getOverview);
router.get("/extended", authMiddleware, adminMiddleware, analyticsController.getExtended);
router.get("/onboarding-status", authMiddleware, adminMiddleware, analyticsController.getOnboardingStatus);
router.get("/departments", authMiddleware, adminMiddleware, analyticsController.getDepartments);
router.get("/employees/:employeeId/summary", authMiddleware, analyticsController.getEmployeeSummary);

export default router;
