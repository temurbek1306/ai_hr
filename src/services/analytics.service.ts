import api from '../api/axios';
import type {
    AnalyticsOverviewDto,
    AdminDashboardExtendedDto,
    OnboardingStatusAnalyticsDto,
    AdminDepartmentAnalyticsDto
} from '../types/api.types';

export const analyticsService = {
    /**
     * Get analytics overview
     * GET /api/v1/analytics/overview
     */
    getOverview: async (period?: string, department?: string, status?: string): Promise<AnalyticsOverviewDto> => {
        try {
            const params: any = {};
            if (period) params.period = period;
            if (department) params.department = department;
            if (status) params.status = status;

            const response = await api.get<AnalyticsOverviewDto>('/api/v1/analytics/overview', { params });
            return response.data;
        } catch (error: any) {
            console.error('Failed to fetch analytics overview:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch analytics overview');
        }
    },

    /**
     * Get extended analytics
     * GET /api/v1/analytics/extended
     */
    getExtended: async (): Promise<AdminDashboardExtendedDto> => {
        try {
            const response = await api.get<AdminDashboardExtendedDto>('/api/v1/analytics/extended');
            return response.data;
        } catch (error: any) {
            console.error('Failed to fetch extended analytics:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch extended analytics');
        }
    },

    /**
     * Get onboarding status analytics
     * GET /api/v1/admin/analytics/onboarding-status
     */
    getOnboardingStatus: async (): Promise<OnboardingStatusAnalyticsDto> => {
        try {
            const response = await api.get<OnboardingStatusAnalyticsDto>('/api/v1/admin/analytics/onboarding-status');
            return response.data;
        } catch (error: any) {
            console.error('Failed to fetch onboarding status:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch onboarding status');
        }
    },

    /**
     * Get department analytics
     * GET /api/v1/admin/analytics/departments
     */
    getDepartments: async (): Promise<AdminDepartmentAnalyticsDto[]> => {
        try {
            const response = await api.get<AdminDepartmentAnalyticsDto[]>('/api/v1/admin/analytics/departments');
            return response.data;
        } catch (error: any) {
            console.error('Failed to fetch department analytics:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch department analytics');
        }
    },

    /**
     * Get employee summary
     * GET /api/v1/analytics/employees/{employeeId}/summary
     */
    getEmployeeSummary: async (employeeId: string): Promise<any> => {
        try {
            const response = await api.get(`/api/v1/analytics/employees/${employeeId}/summary`);
            return response.data;
        } catch (error: any) {
            console.error('Failed to fetch employee summary:', error);
            // Return mock data if API fails
            return {
                firstName: 'User',
                lastName: 'Name',
                email: 'user@aihr.uz',
                phone: '+998 90 000 00 00',
                position: 'Employee',
                department: 'Department',
                joinDate: new Date().toISOString(),
                location: 'Tashkent, Uzbekistan'
            };
        }
    }
};
