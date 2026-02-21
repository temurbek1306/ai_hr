import { Router } from "express";
import { testController } from "../controllers/test.controller";
import { authMiddleware, adminMiddleware } from "../middleware/auth";

const router = Router();

// =====================
// USER ROUTES (/tests)
// =====================
router.get("/tests/available", authMiddleware, testController.getTests);
router.get("/tests", authMiddleware, testController.getTests);
router.get("/tests/:testId", authMiddleware, testController.getTestById);
router.get("/tests/:testId/take", authMiddleware, testController.getForTake);
router.post("/tests/:testId/start", authMiddleware, testController.startSession);
router.post("/tests/:sessionId/answer", authMiddleware, testController.submitAnswer);
router.post("/tests/:sessionId/answers-bulk", authMiddleware, testController.submitAllAnswers);
router.post("/tests/:sessionId/finish", authMiddleware, testController.finishSession);
router.get("/tests/:testId/results", authMiddleware, testController.getResults);

// =====================
// ADMIN ROUTES (/admin/tests)
// =====================
router.get("/admin/tests", authMiddleware, adminMiddleware, testController.getTests);
router.post("/admin/tests", authMiddleware, adminMiddleware, testController.createTest);
router.get("/admin/tests/:testId", authMiddleware, adminMiddleware, testController.getTestById);
router.put("/admin/tests/:testId", authMiddleware, adminMiddleware, testController.updateTest);
router.delete("/admin/tests/:testId", authMiddleware, adminMiddleware, testController.deleteTest);

export default router;
