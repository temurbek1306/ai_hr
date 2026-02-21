import { Router } from "express";
import { uploadController, feedbackController } from "../controllers/upload.controller";
import { ndaController, permissionController } from "../controllers/admin_actions.controller";
import { reportController } from "../controllers/report.controller";
import { surveyController } from "../controllers/survey.controller";
import { authMiddleware, adminMiddleware } from "../middleware/auth";

const router = Router();

// =====================
// MISC & ADMIN ACTIONS
// =====================
router.post("/upload", authMiddleware, uploadController.uploadFile);
router.post("/feedback", authMiddleware, feedbackController.submit);
router.post("/admin/nda/:employeeId", authMiddleware, adminMiddleware, ndaController.accept);
router.get("/admin/nda", authMiddleware, ndaController.getCurrent);
router.put("/admin/permissions/:employeeId", authMiddleware, adminMiddleware, permissionController.update);
router.get("/admin/reports", authMiddleware, adminMiddleware, reportController.getAll);
router.post("/admin/reports/generate", authMiddleware, adminMiddleware, reportController.generate);
router.get("/admin/reports/:id/download", authMiddleware, adminMiddleware, reportController.download);
router.get("/admin/reports/tests", authMiddleware, adminMiddleware, reportController.getTestsReport);
router.get("/admin/reports/employees", authMiddleware, adminMiddleware, reportController.getEmployeeReport);

router.get("/reports", authMiddleware, reportController.getAll); // Alias for frontend compatibility
router.get("/reports/:id/download", authMiddleware, reportController.download); // Alias for frontend compatibility
router.get("/surveys", authMiddleware, surveyController.getSurveys);

export default router;
