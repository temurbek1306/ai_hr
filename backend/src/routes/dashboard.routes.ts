import { Router } from "express";
import { dashboardController } from "../controllers/dashboard.controller";
import { analyticsController } from "../controllers/analytics.controller";
import { calendarController } from "../controllers/calendar.controller";
import { notificationController } from "../controllers/notification.controller";
import { authMiddleware, adminMiddleware } from "../middleware/auth";

const router = Router();

// =====================
// DASHBOARD & ANALYTICS (Admin)
// =====================
router.get("/admin/dashboard", authMiddleware, adminMiddleware, dashboardController.getDashboard);
router.get("/admin/dashboard/summary", authMiddleware, adminMiddleware, dashboardController.getSummary);
router.get("/admin/dashboard/extended-stats", authMiddleware, adminMiddleware, dashboardController.getExtendedStats);
router.get("/admin/activities", authMiddleware, adminMiddleware, dashboardController.getActivities);
router.get("/analytics/overview", authMiddleware, analyticsController.getOverview);
router.get("/analytics/departments", authMiddleware, analyticsController.getDepartments);

// =====================
// CALENDAR & NOTIFICATIONS
// =====================
router.get("/calendar/events", authMiddleware, calendarController.getEvents);
router.post("/calendar/events", authMiddleware, calendarController.createEvent);
router.get("/reminders", authMiddleware, calendarController.getReminders);
router.get("/notifications", authMiddleware, notificationController.getAll);
router.put("/notifications/:id/read", authMiddleware, notificationController.markRead);

export default router;
