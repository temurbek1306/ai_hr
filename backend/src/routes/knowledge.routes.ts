import { Router } from "express";
import { articleController } from "../controllers/article.controller";
import { onboardingController } from "../controllers/onboarding.controller";
import { authMiddleware, adminMiddleware } from "../middleware/auth";

const router = Router();

// =====================
// KNOWLEDGE BASE ROUTES
// =====================
router.get("/knowledge/articles", authMiddleware, articleController.getAll);
router.post("/knowledge/articles", authMiddleware, adminMiddleware, articleController.create);
router.get("/knowledge/categories", authMiddleware, (_req, res) => res.json([]));

// =====================
// ONBOARDING ROUTES
// =====================
router.get("/onboarding/materials", authMiddleware, onboardingController.getAll);
router.get("/onboarding/materials/:materialId", authMiddleware, onboardingController.getById);

export default router;
