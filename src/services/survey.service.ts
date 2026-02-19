import api from '../api/axios';
import type {
    ApiResponse,
    SurveyDto,
    SurveyQuestionDto,
    SurveyResponseDto,
    SurveyAnswerDetailDto
} from '../types/api.types';

export const surveyService = {
    getAll: async (): Promise<SurveyDto[]> => {
        try {
            const response = await api.get<ApiResponse<SurveyDto[]>>('/api/v1/surveys');
            return response.data.body || (response.data as any);
        } catch (error: any) {
            console.error('Failed to fetch surveys:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch surveys');
        }
    },

    /**
     * Get survey by ID
     * GET /api/v1/surveys/{id}
     */
    getById: async (id: string): Promise<SurveyDto> => {
        try {
            const response = await api.get<ApiResponse<SurveyDto>>(`/api/v1/surveys/${id}`);
            return response.data.body || (response.data as any);
        } catch (error: any) {
            console.error('Failed to fetch survey:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch survey');
        }
    },

    create: async (data: Omit<SurveyDto, 'id'>): Promise<SurveyDto> => {
        try {
            const response = await api.post<ApiResponse<SurveyDto>>('/api/v1/surveys', data);
            return response.data.body || (response.data as any);
        } catch (error: any) {
            console.error('Failed to create survey:', error);
            throw new Error(error.response?.data?.message || 'Failed to create survey');
        }
    },

    update: async (id: string, data: Omit<SurveyDto, 'id'>): Promise<SurveyDto> => {
        try {
            const response = await api.put<ApiResponse<SurveyDto>>(`/api/v1/surveys/${id}`, data);
            return response.data.body || (response.data as any);
        } catch (error: any) {
            console.error('Failed to update survey:', error);
            throw new Error(error.response?.data?.message || 'Failed to update survey');
        }
    },

    getQuestions: async (surveyId: string): Promise<SurveyQuestionDto[]> => {
        try {
            const response = await api.get<ApiResponse<SurveyQuestionDto[]>>(`/api/v1/surveys/${surveyId}/questions`);
            return response.data.body || (response.data as any);
        } catch (error: any) {
            console.error('Failed to fetch survey questions:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch survey questions');
        }
    },

    /**
     * Add question to survey
     * POST /api/v1/surveys/{id}/questions
     */
    addQuestion: async (surveyId: string, question: Omit<SurveyQuestionDto, 'id'>): Promise<SurveyQuestionDto> => {
        try {
            const response = await api.post<ApiResponse<SurveyQuestionDto>>(`/api/v1/surveys/${surveyId}/questions`, question);
            return response.data.body || (response.data as any);
        } catch (error: any) {
            console.error('Failed to add survey question:', error);
            throw new Error(error.response?.data?.message || 'Failed to add survey question');
        }
    },

    /**
     * Submit survey response
     * POST /api/v1/surveys/{id}/submit
     */
    submitResponse: async (surveyId: string, response: SurveyResponseDto): Promise<string> => {
        try {
            const result = await api.post<string>(`/api/v1/surveys/${surveyId}/submit`, response);
            return result.data;
        } catch (error: any) {
            console.error('Failed to submit survey response:', error);
            throw new Error(error.response?.data?.message || 'Failed to submit survey response');
        }
    },

    /**
     * Submit survey responses (alternative endpoint)
     * POST /api/v1/surveys/{id}/responses
     */
    submitResponses: async (surveyId: string, response: SurveyResponseDto): Promise<string> => {
        try {
            const result = await api.post<string>(`/api/v1/surveys/${surveyId}/responses`, response);
            return result.data;
        } catch (error: any) {
            console.error('Failed to submit survey responses:', error);
            throw new Error(error.response?.data?.message || 'Failed to submit survey responses');
        }
    },

    getResponses: async (surveyId: string): Promise<SurveyAnswerDetailDto[]> => {
        try {
            const response = await api.get<ApiResponse<SurveyAnswerDetailDto[]>>(`/api/v1/surveys/${surveyId}/responses`);
            return response.data.body || (response.data as any);
        } catch (error: any) {
            console.error('Failed to fetch survey responses:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch survey responses');
        }
    }
};
