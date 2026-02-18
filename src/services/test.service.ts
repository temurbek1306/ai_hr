import api from '../api/axios';
import type {
    ApiResponse,
    TestDTO,
    TestCreateDto,
    TestDetailDto,
    TestAnalyticsDto,
    TestAnswerDTO,
    TestSubmitRequestDto,
    TestResultsResponseDto
} from '../types/api.types';

// Re-export types for convenience
export type { TestCreateDto, TestDTO, TestQuestionCreateDto, TestDetailDto } from '../types/api.types';

export const testService = {
    /**
     * Get all tests (Admin)
     * GET /api/v1/tests
     */
    getAll: async (): Promise<TestDTO[]> => {
        try {
            const response = await api.get<TestDTO[]>('/api/v1/tests');
            return response.data;
        } catch (error: any) {
            console.error('Failed to fetch tests:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch tests');
        }
    },

    /**
     * Get available tests for current user
     * GET /api/v1/tests/available
     */
    getAvailableTests: async (): Promise<ApiResponse<TestDTO[]>> => {
        try {
            const response = await api.get<ApiResponse<TestDTO[]>>('/api/v1/tests/available');
            return response.data;
        } catch (error: any) {
            console.error('Failed to fetch available tests:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch available tests');
        }
    },

    /**
     * Create new test
     * POST /api/v1/tests
     */
    createTest: async (testData: TestCreateDto): Promise<TestDetailDto> => {
        try {
            const response = await api.post<TestDetailDto>('/api/v1/tests', testData);
            return response.data;
        } catch (error: any) {
            console.error('Failed to create test:', error);
            throw new Error(error.response?.data?.message || 'Failed to create test');
        }
    },

    /**
     * Update existing test
     * PUT /api/v1/tests/{id}
     */
    updateTest: async (testId: string, testData: TestCreateDto): Promise<TestDetailDto> => {
        try {
            const response = await api.put<TestDetailDto>(`/api/v1/tests/${testId}`, testData);
            return response.data;
        } catch (error: any) {
            console.error('Failed to update test:', error);
            throw new Error(error.response?.data?.message || 'Failed to update test');
        }
    },

    /**
     * Delete test
     * DELETE /api/v1/tests/{id}
     */
    deleteTest: async (testId: string): Promise<string> => {
        try {
            const response = await api.delete<string>(`/api/v1/tests/${testId}`);
            return response.data;
        } catch (error: any) {
            console.error('Failed to delete test:', error);
            throw new Error(error.response?.data?.message || 'Failed to delete test');
        }
    },

    /**
     * Get test analytics
     * GET /api/v1/tests/{id}/analytics
     */
    getTestAnalytics: async (testId: string): Promise<TestAnalyticsDto> => {
        try {
            const response = await api.get<TestAnalyticsDto>(`/api/v1/tests/${testId}/analytics`);
            return response.data;
        } catch (error: any) {
            console.error('Failed to fetch test analytics:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch test analytics');
        }
    },

    /**
     * Start a test session
     * POST /api/v1/tests/{id}/start
     */
    startSession: async (testId: string, employeeId?: string): Promise<ApiResponse<any>> => {
        try {
            const params = employeeId ? { employeeId } : {};
            const response = await api.post<ApiResponse<any>>(`/api/v1/tests/${testId}/start`, null, { params });
            return response.data;
        } catch (error: any) {
            console.error('Failed to start test session:', error);
            throw new Error(error.response?.data?.message || 'Failed to start test session');
        }
    },

    /**
     * Submit an answer during test
     * POST /api/v1/tests/{sessionId}/answer
     */
    submitAnswer: async (sessionId: string, answerData: TestAnswerDTO): Promise<ApiResponse<string>> => {
        try {
            const response = await api.post<ApiResponse<string>>(`/api/v1/tests/${sessionId}/answer`, answerData);
            return response.data;
        } catch (error: any) {
            console.error('Failed to submit answer:', error);
            throw new Error(error.response?.data?.message || 'Failed to submit answer');
        }
    },

    /**
     * Submit complete test with all answers
     * POST /api/v1/tests/{id}/submit
     */
    submitTest: async (testId: string, submitData: TestSubmitRequestDto): Promise<ApiResponse<any>> => {
        try {
            const response = await api.post<ApiResponse<any>>(`/api/v1/tests/${testId}/submit`, submitData);
            return response.data;
        } catch (error: any) {
            console.error('Failed to submit test:', error);
            throw new Error(error.response?.data?.message || 'Failed to submit test');
        }
    },

    /**
     * Finish test session
     * POST /api/v1/tests/{sessionId}/finish
     */
    finishSession: async (sessionId: string): Promise<ApiResponse<string>> => {
        try {
            const response = await api.post<ApiResponse<string>>(`/api/v1/tests/${sessionId}/finish`);
            return response.data;
        } catch (error: any) {
            console.error('Failed to finish test session:', error);
            throw new Error(error.response?.data?.message || 'Failed to finish test session');
        }
    },

    /**
     * Get test results
     * GET /api/v1/tests/{id}/results
     */
    getResults: async (testId: string): Promise<TestResultsResponseDto> => {
        try {
            const response = await api.get<TestResultsResponseDto>(`/api/v1/tests/${testId}/results`);
            return response.data;
        } catch (error: any) {
            console.error('Failed to fetch test results:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch test results');
        }
    }
};
