import api from '../api/axios';
import type { ApiResponse } from '../types/api.types';

export const ndaService = {
    /**
     * Get current NDA document
     * GET /api/v1/nda/current
     */
    getCurrent: async (): Promise<ApiResponse<any>> => {
        try {
            const response = await api.get<ApiResponse<any>>('/api/v1/nda/current');
            return response.data;
        } catch (error: any) {
            console.error('Failed to fetch NDA:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch NDA');
        }
    },

    /**
     * Accept NDA for employee
     * POST /api/v1/employees/{id}/nda/accept
     */
    accept: async (employeeId: string): Promise<ApiResponse<any>> => {
        try {
            const response = await api.post<ApiResponse<any>>(`/api/v1/employees/${employeeId}/nda/accept`);
            return response.data;
        } catch (error: any) {
            console.error('Failed to accept NDA:', error);
            throw new Error(error.response?.data?.message || 'Failed to accept NDA');
        }
    }
};
