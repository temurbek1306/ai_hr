import api from '../api/axios';
import type { ApiResponse, FeedbackDTO } from '../types/api.types';

export const feedbackService = {
    /**
     * Send feedback
     * POST /api/v1/feedback
     */
    send: async (data: Omit<FeedbackDTO, 'id' | 'status' | 'createdAt'>): Promise<ApiResponse<any>> => {
        try {
            const response = await api.post<ApiResponse<any>>('/api/v1/feedback', data);
            return response.data;
        } catch (error: any) {
            console.error('Failed to send feedback:', error);
            throw new Error(error.response?.data?.message || 'Failed to send feedback');
        }
    },

    // Alias for backward compatibility
    submitFeedback: async (data: Omit<FeedbackDTO, 'id' | 'status' | 'createdAt'>): Promise<ApiResponse<any>> => {
        return feedbackService.send(data);
    }
};
