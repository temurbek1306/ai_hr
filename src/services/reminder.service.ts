import api from '../api/axios';
import type { ReminderDto } from '../types/api.types';

export const reminderService = {
    /**
     * Get reminders (optionally filtered by employee)
     * GET /api/v1/reminders
     */
    getReminders: async (employeeId?: string): Promise<ReminderDto[]> => {
        try {
            const params = employeeId ? { employeeId } : {};
            const response = await api.get<ReminderDto[]>('/api/v1/reminders', { params });
            return response.data;
        } catch (error: any) {
            console.error('Failed to fetch reminders:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch reminders');
        }
    },

    /**
     * Create new reminder
     * POST /api/v1/reminders
     */
    createReminder: async (data: Omit<ReminderDto, 'id' | 'sent'>): Promise<ReminderDto> => {
        try {
            const response = await api.post<ReminderDto>('/api/v1/reminders', data);
            return response.data;
        } catch (error: any) {
            console.error('Failed to create reminder:', error);
            throw new Error(error.response?.data?.message || 'Failed to create reminder');
        }
    },

    /**
     * Mark reminder as sent
     * POST /api/v1/reminders/{id}/sent
     */
    markAsSent: async (id: string): Promise<ReminderDto> => {
        try {
            const response = await api.post<ReminderDto>(`/api/v1/reminders/${id}/sent`);
            return response.data;
        } catch (error: any) {
            console.error('Failed to mark reminder as sent:', error);
            throw new Error(error.response?.data?.message || 'Failed to mark reminder as sent');
        }
    }
};
