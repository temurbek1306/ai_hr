import { Router } from "express";
import { employeeController } from "../controllers/employee.controller";
import { authMiddleware, adminMiddleware } from "../middleware/auth";

const router = Router();

// =====================
// USER ROUTES (/me)
// =====================
router.get("/me", authMiddleware, employeeController.getMe);
router.put("/me", authMiddleware, employeeController.updateMe);
router.get("/me/activities", authMiddleware, employeeController.getMeActivities);
router.get("/me/summary", authMiddleware, employeeController.getMeSummary);
router.get("/me/test-results", authMiddleware, employeeController.getMeTestResults);

// =====================
// ADMIN ROUTES
// =====================
router.post("/import", authMiddleware, adminMiddleware, employeeController.importEmployees);
router.get("/export", authMiddleware, adminMiddleware, employeeController.exportEmployees);
router.post("/cleanup-ghosts", authMiddleware, adminMiddleware, employeeController.cleanupGhosts);

router.get("/", authMiddleware, adminMiddleware, employeeController.getAll);
router.post("/", authMiddleware, adminMiddleware, employeeController.create);
router.get("/:employeeId", authMiddleware, adminMiddleware, employeeController.getById);
router.put("/:employeeId", authMiddleware, adminMiddleware, employeeController.update);
router.delete("/:employeeId", authMiddleware, adminMiddleware, employeeController.delete);

// =====================
// SPECIFIC ID ROUTES
// =====================
router.get("/:id/summary", authMiddleware, employeeController.getSummary);
router.get("/:id/assignments", authMiddleware, employeeController.getAssignments);
router.post("/:id/assignments", authMiddleware, adminMiddleware, employeeController.createAssignment);

export default router;
