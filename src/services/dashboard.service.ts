import api from '../api/axios';
import type {
    AdminDashboardDto,
    AdminDashboardSummaryDto,
    AdminDashboardExtendedDto,
    AdminActivityDto
} from '../types/api.types';

export const dashboardService = {
    /**
     * Get admin dashboard data
     * GET /api/v1/admin/dashboard
     */
    getDashboard: async (): Promise<AdminDashboardDto> => {
        try {
            const response = await api.get<AdminDashboardDto>('/api/v1/admin/dashboard');
            return response.data;
        } catch (error: any) {
            console.error('Failed to fetch dashboard data:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data');
        }
    },

    /**
     * Get dashboard summary with filters
     * GET /api/v1/admin/dashboard/summary
     */
    getSummary: async (period?: string, department?: string, status?: string): Promise<AdminDashboardSummaryDto> => {
        try {
            const params: any = {};
            if (period) params.period = period;
            if (department) params.department = department;
            if (status) params.status = status;

            const response = await api.get<AdminDashboardSummaryDto>('/api/v1/admin/dashboard/summary', { params });
            return response.data;
        } catch (error: any) {
            console.error('Failed to fetch dashboard summary:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch dashboard summary');
        }
    },

    /**
     * Get extended dashboard statistics
     * GET /api/v1/admin/dashboard/extended-stats
     */
    getExtendedStats: async (): Promise<AdminDashboardExtendedDto> => {
        try {
            const response = await api.get<AdminDashboardExtendedDto>('/api/v1/admin/dashboard/extended-stats');
            return response.data;
        } catch (error: any) {
            console.error('Failed to fetch extended stats:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch extended stats');
        }
    },

    /**
     * Get recent activities
     * GET /api/v1/admin/activities
     */
    getActivities: async (): Promise<AdminActivityDto[]> => {
        try {
            const response = await api.get<AdminActivityDto[]>('/api/v1/admin/activities');
            return response.data;
        } catch (error: any) {
            console.error('Failed to fetch activities:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch activities');
        }
    }
};
