import { Router } from "express";
import { surveyTriggerController } from "../controllers/survey-trigger.controller";
import { authMiddleware, adminMiddleware } from "../middleware/auth";

const router = Router();

router.get("/admin/survey-triggers", authMiddleware, adminMiddleware, surveyTriggerController.getAll);
router.post("/admin/survey-triggers", authMiddleware, adminMiddleware, surveyTriggerController.create);
router.put("/admin/survey-triggers/:id/toggle", authMiddleware, adminMiddleware, surveyTriggerController.toggleStatus);
router.delete("/admin/survey-triggers/:id", authMiddleware, adminMiddleware, surveyTriggerController.delete);

export default router;
