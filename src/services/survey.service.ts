import api from '../api/axios';
import type {
    SurveyDto,
    SurveyQuestionDto,
    SurveyResponseDto,
    SurveyAnswerDetailDto
} from '../types/api.types';

export const surveyService = {
    /**
     * Get all surveys
     * GET /api/v1/surveys
     */
    getAll: async (): Promise<SurveyDto[]> => {
        try {
            const response = await api.get<SurveyDto[]>('/api/v1/surveys');
            return response.data;
        } catch (error: any) {
            console.error('Failed to fetch surveys:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch surveys');
        }
    },

    /**
     * Create new survey
     * POST /api/v1/surveys
     */
    create: async (data: Omit<SurveyDto, 'id'>): Promise<SurveyDto> => {
        try {
            const response = await api.post<SurveyDto>('/api/v1/surveys', data);
            return response.data;
        } catch (error: any) {
            console.error('Failed to create survey:', error);
            throw new Error(error.response?.data?.message || 'Failed to create survey');
        }
    },

    /**
     * Get survey questions
     * GET /api/v1/surveys/{id}/questions
     */
    getQuestions: async (surveyId: string): Promise<SurveyQuestionDto[]> => {
        try {
            const response = await api.get<SurveyQuestionDto[]>(`/api/v1/surveys/${surveyId}/questions`);
            return response.data;
        } catch (error: any) {
            console.error('Failed to fetch survey questions:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch survey questions');
        }
    },

    /**
     * Add question to survey
     * POST /api/v1/surveys/{id}/questions
     */
    /**
     * Add question to survey
     * POST /api/v1/surveys/{id}/questions
     */
    addQuestion: async (surveyId: string, question: Omit<SurveyQuestionDto, 'id'>): Promise<SurveyQuestionDto> => {
        try {
            const response = await api.post<SurveyQuestionDto>(`/api/v1/surveys/${surveyId}/questions`, question);
            return response.data;
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

    /**
     * Get survey responses
     * GET /api/v1/surveys/{id}/responses
     */
    getResponses: async (surveyId: string): Promise<SurveyAnswerDetailDto[]> => {
        try {
            const response = await api.get<SurveyAnswerDetailDto[]>(`/api/v1/surveys/${surveyId}/responses`);
            return response.data;
        } catch (error: any) {
            console.error('Failed to fetch survey responses:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch survey responses');
        }
    }
};
