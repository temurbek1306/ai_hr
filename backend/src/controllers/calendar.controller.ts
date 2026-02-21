import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { CalendarEvent } from "../entities/CalendarEvent";
import { Reminder } from "../entities/Reminder";
import { Employee } from "../entities/Employee";

export const calendarController = {
    getEvents: async (req: Request, res: Response) => {
        try {
            const repository = AppDataSource.getRepository(CalendarEvent);
            const events = await repository.find({ relations: ["createdBy"] });
            return res.json({ success: true, body: events });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    createEvent: async (req: Request, res: Response) => {
        try {
            const { title, description, date, type } = req.body;
            const user = (req as any).user;
            const repository = AppDataSource.getRepository(CalendarEvent);

            const event = repository.create({
                title,
                description,
                date,
                type,
                createdBy: user
            });
            await repository.save(event);
            return res.json({ success: true, body: event });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    deleteEvent: async (req: Request, res: Response) => {
        try {
            const repository = AppDataSource.getRepository(CalendarEvent);
            await repository.delete(req.params.id);
            return res.json({ success: true, message: "O'chirildi" });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    getReminders: async (req: Request, res: Response) => {
        try {
            const user = (req as any).user;
            const employeeRepository = AppDataSource.getRepository(Employee);
            const reminderRepository = AppDataSource.getRepository(Reminder);

            const employee = await employeeRepository.findOne({ where: { user: { id: user.id } } });
            if (!employee) return res.json({ success: true, body: [] });

            const reminders = await reminderRepository.find({
                where: { employee: { id: employee.id } },
                order: { scheduledAt: "ASC" }
            });
            return res.json({ success: true, body: reminders });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    createReminder: async (req: Request, res: Response) => {
        try {
            const { message, scheduledAt, employeeId } = req.body;
            const repository = AppDataSource.getRepository(Reminder);
            const employeeRepository = AppDataSource.getRepository(Employee);

            const employee = await employeeRepository.findOne({ where: { id: employeeId } });
            if (!employee) return res.status(404).json({ success: false, message: "Xodim topilmadi" });

            const reminder = repository.create({
                message,
                scheduledAt: new Date(scheduledAt),
                employee
            });
            await repository.save(reminder);
            return res.json({ success: true, body: reminder });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    markAsSent: async (req: Request, res: Response) => {
        try {
            const repository = AppDataSource.getRepository(Reminder);
            await repository.update(req.params.id, { sent: true });
            return res.json({ success: true, message: "Yuborildi deb belgilandi" });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};
