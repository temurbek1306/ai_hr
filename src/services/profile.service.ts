import api from '../api/axios';
import type {
    ApiResponse,
    ProfileUpdateDto,
    PasswordChangeDto,
    NotificationSettingsDto
} from '../types/api.types';

export const profileService = {
    /**
     * Get current user profile
     * GET /api/v1/employees/me
     */
    getProfile: async (): Promise<ApiResponse<any>> => {
        try {
            const response = await api.get<ApiResponse<any>>('/api/v1/employees/me');
            return response.data.body;
        } catch (error: any) {
            console.error('Failed to fetch profile:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch profile');
        }
    },

    /**
     * Update current user profile
     * PUT /api/v1/employees/me
     */
    updateProfile: async (data: ProfileUpdateDto): Promise<ApiResponse<any>> => {
        try {
            const response = await api.put<ApiResponse<any>>('/api/v1/employees/me', data);
            return response.data.body;
        } catch (error: any) {
            console.error('Failed to update profile:', error);
            throw new Error(error.response?.data?.message || 'Failed to update profile');
        }
    },

    /**
     * Change password
     * POST /api/v1/employees/me/password
     */
    changePassword: async (data: PasswordChangeDto): Promise<ApiResponse<any>> => {
        try {
            const response = await api.post<ApiResponse<any>>('/api/v1/employees/me/password', data);
            return response.data.body;
        } catch (error: any) {
            console.error('Failed to change password:', error);
            throw new Error(error.response?.data?.message || 'Failed to change password');
        }
    },

    /**
     * Update avatar
     * POST /api/v1/employees/me/avatar
     */
    updateAvatar: async (file: File): Promise<ApiResponse<any>> => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await api.post<ApiResponse<any>>('/api/v1/employees/me/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.body;
        } catch (error: any) {
            console.error('Failed to update avatar:', error);
            throw new Error(error.response?.data?.message || 'Failed to update avatar');
        }
    },

    /**
     * Get notification settings
     * GET /api/v1/employees/me/settings/notifications
     */
    getNotificationSettings: async (): Promise<ApiResponse<any>> => {
        try {
            const response = await api.get<ApiResponse<any>>('/api/v1/employees/me/settings/notifications');
            return response.data.body;
        } catch (error: any) {
            console.error('Failed to fetch notification settings:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch notification settings');
        }
    },

    /**
     * Update notification settings
     * PUT /api/v1/employees/me/settings/notifications
     */
    updateNotificationSettings: async (data: NotificationSettingsDto): Promise<ApiResponse<any>> => {
        try {
            const response = await api.put<ApiResponse<any>>('/api/v1/employees/me/settings/notifications', data);
            return response.data.body;
        } catch (error: any) {
            console.error('Failed to update notification settings:', error);
            throw new Error(error.response?.data?.message || 'Failed to update notification settings');
        }
    },

    /**
     * Get user test results
     * GET /api/v1/employees/me/test-results
     */
    getTestResults: async (): Promise<ApiResponse<any>> => {
        try {
            const response = await api.get<ApiResponse<any>>('/api/v1/employees/me/test-results');
            return response.data.body;
        } catch (error: any) {
            console.error('Failed to fetch test results:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch test results');
        }
    },

    /**
     * Export test results
     * GET /api/v1/employees/me/test-results/export
     */
    exportTestResults: async (format: string = 'csv'): Promise<string> => {
        try {
            const response = await api.get<string>('/api/v1/employees/me/test-results/export', {
                params: { format }
            });
            return response.data;
        } catch (error: any) {
            console.error('Failed to export test results:', error);
            throw new Error(error.response?.data?.message || 'Failed to export test results');
        }
    },

    /**
     * Get user summary
     * GET /api/v1/employees/me/summary
     */
    getSummary: async (): Promise<ApiResponse<any>> => {
        try {
            const response = await api.get<ApiResponse<any>>('/api/v1/employees/me/summary');
            return response.data.body;
        } catch (error: any) {
            console.error('Failed to fetch summary:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch summary');
        }
    },

    /**
     * Get growth data
     * GET /api/v1/employees/me/growth
     */
    getGrowth: async (period: string = '6months'): Promise<ApiResponse<any>> => {
        try {
            const response = await api.get<ApiResponse<any>>('/api/v1/employees/me/growth', {
                params: { period }
            });
            return response.data.body;
        } catch (error: any) {
            console.error('Failed to fetch growth data:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch growth data');
        }
    },

    /**
     * Get feedback history
     * GET /api/v1/employees/me/feedback
     */
    getFeedbackHistory: async (): Promise<ApiResponse<any>> => {
        try {
            const response = await api.get<ApiResponse<any>>('/api/v1/employees/me/feedback');
            return response.data.body;
        } catch (error: any) {
            console.error('Failed to fetch feedback history:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch feedback history');
        }
    },

    /**
     * Get recent activities
     * GET /api/v1/employees/me/activities
     */
    getActivities: async (limit: number = 5): Promise<ApiResponse<any>> => {
        try {
            const response = await api.get<ApiResponse<any>>('/api/v1/employees/me/activities', {
                params: { limit }
            });
            return response.data.body;
        } catch (error: any) {
            console.error('Failed to fetch activities:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch activities');
        }
    }
};
