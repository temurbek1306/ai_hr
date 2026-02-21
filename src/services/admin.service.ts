import api from '../api/axios';
import type {
    ApiResponse,
    AdminDashboardDto,
    AdminDashboardExtendedDto,
    AdminDashboardSummaryDto,
    OnboardingStatusAnalyticsDto,
    DepartmentCountDto,
    AdminActivityDto
} from '../types/api.types';

export const adminService = {
    /**
     * Get dashboard summary
     * GET /api/v1/admin/dashboard/summary
     */
    getDashboardSummary: async (): Promise<AdminDashboardSummaryDto> => {
        try {
            const response = await api.get<ApiResponse<AdminDashboardSummaryDto>>('/api/v1/admin/dashboard/summary');
            return response.data.body || (response.data as any);
        } catch (error: any) {
            console.error('Failed to fetch dashboard summary:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch dashboard summary');
        }
    },

    /**
     * Get full dashboard data
     * GET /api/v1/admin/dashboard
     */
    getDashboard: async (): Promise<AdminDashboardDto> => {
        try {
            const response = await api.get<ApiResponse<AdminDashboardDto>>('/api/v1/admin/dashboard');
            return response.data.body || (response.data as any);
        } catch (error: any) {
            console.error('Failed to fetch dashboard data:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data');
        }
    },

    /**
     * Get extended dashboard stats (inc. recent activities)
     * GET /api/v1/admin/dashboard/extended-stats
     */
    getExtendedStats: async (): Promise<AdminDashboardExtendedDto> => {
        try {
            const response = await api.get<ApiResponse<AdminDashboardExtendedDto>>('/api/v1/admin/dashboard/extended-stats');
            return response.data.body || (response.data as any);
        } catch (error: any) {
            console.error('Failed to fetch extended stats:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch extended stats');
        }
    },

    /**
     * Get admin activities
     * GET /api/v1/admin/activities
     */
    getActivities: async (): Promise<AdminActivityDto[]> => {
        try {
            const response = await api.get<ApiResponse<AdminActivityDto[]>>('/api/v1/admin/activities');
            return response.data.body || (response.data as any);
        } catch (error: any) {
            console.error('Failed to fetch activities:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch activities');
        }
    },

    /**
     * Get department analytics
     * GET /api/v1/admin/analytics/departments
     */
    getDepartmentAnalytics: async (): Promise<DepartmentCountDto[]> => {
        try {
            const response = await api.get<ApiResponse<DepartmentCountDto[]>>('/api/v1/admin/analytics/departments');
            return response.data.body || (response.data as any);
        } catch (error: any) {
            console.error('Failed to fetch department analytics:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch department analytics');
        }
    },

    /**
     * Get onboarding status analytics
     * GET /api/v1/admin/analytics/onboarding-status
     */
    getOnboardingAnalytics: async (): Promise<OnboardingStatusAnalyticsDto> => {
        try {
            const response = await api.get<ApiResponse<OnboardingStatusAnalyticsDto>>('/api/v1/admin/analytics/onboarding-status');
            return response.data.body || (response.data as any);
        } catch (error: any) {
            console.error('Failed to fetch onboarding analytics:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch onboarding analytics');
        }
    }
};
