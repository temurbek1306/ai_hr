import { Router } from "express";
import { calendarController } from "../controllers/calendar.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// =====================
// CALENDAR ROUTES
// =====================
router.get("/events", authMiddleware, calendarController.getEvents);
router.post("/events", authMiddleware, calendarController.createEvent);
router.delete("/events/:id", authMiddleware, calendarController.deleteEvent);
router.get("/reminders", authMiddleware, calendarController.getReminders);

export default router;
