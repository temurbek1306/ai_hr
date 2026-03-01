import api from '../api/axios';
import type { ApiResponse } from '../types/api.types';

export interface SurveyTriggerDto {
    id: string;
    name: string;
    event: string;
    surveyName: string;
    status: 'active' | 'paused';
    createdAt: string;
}

export const surveyTriggerService = {
    getAll: async (): Promise<SurveyTriggerDto[]> => {
        try {
            const response = await api.get<ApiResponse<SurveyTriggerDto[]>>('/admin/survey-triggers');
            return response.data.body || (response.data as any);
        } catch (error: any) {
            console.error('Failed to fetch survey triggers:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch triggers');
        }
    },

    create: async (data: Omit<SurveyTriggerDto, 'id' | 'status' | 'createdAt'>): Promise<SurveyTriggerDto> => {
        try {
            const response = await api.post<ApiResponse<SurveyTriggerDto>>('/admin/survey-triggers', data);
            return response.data.body || (response.data as any);
        } catch (error: any) {
            console.error('Failed to create survey trigger:', error);
            throw new Error(error.response?.data?.message || 'Failed to create trigger');
        }
    },

    toggleStatus: async (id: string): Promise<SurveyTriggerDto> => {
        try {
            const response = await api.put<ApiResponse<SurveyTriggerDto>>(`/admin/survey-triggers/${id}/toggle`);
            return response.data.body || (response.data as any);
        } catch (error: any) {
            console.error('Failed to toggle trigger status:', error);
            throw new Error(error.response?.data?.message || 'Failed to toggle status');
        }
    },

    delete: async (id: string): Promise<void> => {
        try {
            await api.delete(`/admin/survey-triggers/${id}`);
        } catch (error: any) {
            console.error('Failed to delete survey trigger:', error);
            throw new Error(error.response?.data?.message || 'Failed to delete trigger');
        }
    }
};
