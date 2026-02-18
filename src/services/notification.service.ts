import api from '../api/axios';
import type { NotificationPageDto } from '../types/api.types';

export const notificationService = {
    /**
     * Get notifications with pagination
     * GET /api/v1/notifications
     */
    getNotifications: async (page: number = 0, size: number = 10, unreadOnly: boolean = false): Promise<NotificationPageDto> => {
        try {
            const response = await api.get<NotificationPageDto>('/api/v1/notifications', {
                params: { page, size, unreadOnly }
            });
            return response.data;
        } catch (error: any) {
            console.error('Failed to fetch notifications:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
        }
    },

    /**
     * Mark notification as read
     * PUT /api/v1/notifications/{id}/read
     */
    markAsRead: async (id: string): Promise<void> => {
        try {
            await api.put(`/api/v1/notifications/${id}/read`);
        } catch (error: any) {
            console.error('Failed to mark notification as read:', error);
            throw new Error(error.response?.data?.message || 'Failed to mark notification as read');
        }
    }
};
