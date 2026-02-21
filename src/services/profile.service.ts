import api from '../api/axios';
import type {
    ApiResponse,
    EmployeeProfileDto,
    EmployeeSummaryDTO,
    TestResultsResponseDto,
    AdminActivityDto
} from '../types/api.types';

export const profileService = {
    /**
     * Get current employee profile
     * GET /api/v1/employees/me
     */
    getMe: async (): Promise<EmployeeProfileDto> => {
        try {
            const response = await api.get<ApiResponse<EmployeeProfileDto>>('/employees/me');
            return response.data.body || (response.data as any);
        } catch (error: any) {
            console.error('Failed to fetch current profile:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch current profile');
        }
    },

    /**
     * Alias for getMe for backward compatibility
     */
    getProfile: async (): Promise<EmployeeProfileDto> => {
        return profileService.getMe();
    },


    /**
     * Update current employee profile
     * PUT /api/v1/employees/me
     */
    updateMe: async (data: Partial<EmployeeProfileDto>): Promise<EmployeeProfileDto> => {
        try {
            const response = await api.put<ApiResponse<EmployeeProfileDto>>('/employees/me', data);
            return response.data.body || (response.data as any);
        } catch (error: any) {
            console.error('Failed to update current profile:', error);
            throw new Error(error.response?.data?.message || 'Failed to update current profile');
        }
    },

    /**
     * Alias for updateMe for backward compatibility
     */
    updateProfile: async (data: Partial<EmployeeProfileDto>): Promise<EmployeeProfileDto> => {
        return profileService.updateMe(data);
    },


    /**
     * Get own activities
     * GET /api/v1/employees/me/activities
     */
    getOwnActivities: async (): Promise<AdminActivityDto[]> => {
        try {
            const response = await api.get<ApiResponse<AdminActivityDto[]>>('/employees/me/activities');
            return response.data.body || (response.data as any);
        } catch (error: any) {
            console.error('Failed to fetch own activities:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch own activities');
        }
    },

    /**
     * Get own summary
     * GET /api/v1/employees/me/summary
     */
    getOwnSummary: async (): Promise<EmployeeSummaryDTO> => {
        try {
            const response = await api.get<ApiResponse<EmployeeSummaryDTO>>('/employees/me/summary');
            return response.data.body || (response.data as any);
        } catch (error: any) {
            console.error('Failed to fetch own summary:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch own summary');
        }
    },

    /**
     * Alias for getOwnSummary for backward compatibility
     */
    getSummary: async (): Promise<EmployeeSummaryDTO> => {
        return profileService.getOwnSummary();
    },


    /**
     * Get own test results
     * GET /api/v1/employees/me/test-results
     */
    getOwnTestResults: async (): Promise<TestResultsResponseDto> => {
        try {
            const response = await api.get<ApiResponse<TestResultsResponseDto>>('/employees/me/test-results');
            return response.data.body || (response.data as any);
        } catch (error: any) {
            console.error('Failed to fetch own test results:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch own test results');
        }
    },

    /**
     * Alias for getOwnTestResults for backward compatibility
     */
    getTestResults: async (): Promise<TestResultsResponseDto> => {
        return profileService.getOwnTestResults();
    },

    /**
     * Export own test results
     * GET /api/v1/employees/me/export
     */
    exportTestResults: async (): Promise<Blob> => {
        try {
            const response = await api.get('/employees/me/export', {
                responseType: 'blob'
            });
            return response.data;
        } catch (error: any) {
            console.error('Failed to export test results:', error);
            throw new Error(error.response?.data?.message || 'Failed to export test results');
        }
    },


    /**
     * Update avatar
     * POST /api/v1/employees/me/avatar
     */
    updateAvatar: async (file: File): Promise<string> => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await api.post<ApiResponse<string>>('/employees/me/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data.body || (response.data as any);
        } catch (error: any) {
            console.error('Failed to upload avatar:', error);
            throw new Error(error.response?.data?.message || 'Failed to upload avatar');
        }
    }
};
