import api from '../api/axios';
import type { ApiResponse, EventDto } from '../types/api.types';

// Export type alias for backward compatibility
export type CalendarEvent = EventDto;

export const calendarService = {
    /**
     * Get events (optionally filtered by date range)
     * GET /api/v1/events
     */
    getEvents: async (startDate?: string, endDate?: string): Promise<EventDto[]> => {
        try {
            const params: any = {};
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const response = await api.get<ApiResponse<EventDto[]>>('/events', { params });
            return (response.data as any).body || response.data;
        } catch (error: any) {
            console.error('Failed to fetch events:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch events');
        }
    },

    /**
     * Create new event
     * POST /api/v1/events
     */
    createEvent: async (data: Omit<EventDto, 'id'>, employeeId?: string): Promise<EventDto> => {
        try {
            const headers: any = {};
            if (employeeId) {
                headers['X-Employee-Id'] = employeeId;
            }

            const response = await api.post<ApiResponse<EventDto>>('/events', data, { headers });
            return (response.data as any).body || response.data;
        } catch (error: any) {
            console.error('Failed to create event:', error);
            throw new Error(error.response?.data?.message || 'Failed to create event');
        }
    },

    /**
     * Delete event
     * DELETE /api/v1/events/{id}
     */
    deleteEvent: async (id: string): Promise<void> => {
        try {
            await api.delete(`/events/${id}`);
        } catch (error: any) {
            console.error('Failed to delete event:', error);
            throw new Error(error.response?.data?.message || 'Failed to delete event');
        }
    }
};
