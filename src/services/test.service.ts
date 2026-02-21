import api from '../api/axios';
import type {
    ApiResponse,
    TestDTO,
    TestCreateDto,
    TestDetailDto,
    TestAnalyticsDto,
    TestAnswerDTO,
    TestSubmitRequestDto,
    TestResultsResponseDto,
    TestTakeDto
} from '../types/api.types';

// Re-export types for convenience
export type { TestCreateDto, TestDTO, TestQuestionCreateDto, TestDetailDto, TestTakeDto } from '../types/api.types';

export const testService = {
    getAll: async (): Promise<TestDTO[]> => {
        try {
            const response = await api.get<ApiResponse<TestDTO[]>>('/api/v1/tests');
            return response.data.body || (response.data as any);
        } catch (error: any) {
            console.error('Failed to fetch tests:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch tests');
        }
    },

    /**
     * Get test by ID (Admin)
     * GET /api/v1/admin/tests/{testId}
     */
    getById: async (testId: string): Promise<TestDetailDto> => {
        try {
            const response = await api.get<ApiResponse<TestDetailDto>>(`/api/v1/admin/tests/${testId}`);
            return response.data.body || (response.data as any);
        } catch (error: any) {
            console.error(`Failed to fetch test ${testId}:`, error);
            throw new Error(error.response?.data?.message || 'Failed to fetch test');
        }
    },

    /**
     * Get test for taking (Employee)
     * GET /api/v1/tests/{testId}/take
     */
    getForTake: async (testId: string): Promise<TestTakeDto> => {
        try {
            const response = await api.get<ApiResponse<TestTakeDto>>(`/api/v1/tests/${testId}/take`);
            return response.data.body || (response.data as any);
        } catch (error: any) {
            console.error(`Failed to fetch test for take ${testId}:`, error);
            throw new Error(error.response?.data?.message || 'Failed to fetch test');
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

    createTest: async (testData: TestCreateDto): Promise<TestDetailDto> => {
        try {
            const response = await api.post<ApiResponse<TestDetailDto>>('/api/v1/admin/tests', testData);
            return response.data.body || (response.data as any);
        } catch (error: any) {
            console.error('Failed to create test:', error);
            throw new Error(error.response?.data?.message || 'Failed to create test');
        }
    },

    updateTest: async (testId: string, testData: TestCreateDto): Promise<TestDetailDto> => {
        try {
            const response = await api.put<ApiResponse<TestDetailDto>>(`/api/v1/admin/tests/${testId}`, testData);
            return response.data.body || (response.data as any);
        } catch (error: any) {
            console.error('Failed to update test:', error);
            throw new Error(error.response?.data?.message || 'Failed to update test');
        }
    },

    deleteTest: async (testId: string): Promise<string> => {
        try {
            const response = await api.delete<ApiResponse<string>>(`/api/v1/admin/tests/${testId}`);
            return response.data.body || (response.data as any);
        } catch (error: any) {
            console.error('Failed to delete test:', error);
            throw new Error(error.response?.data?.message || 'Failed to delete test');
        }
    },

    getTestAnalytics: async (testId: string): Promise<TestAnalyticsDto> => {
        try {
            const response = await api.get<ApiResponse<TestAnalyticsDto>>(`/api/v1/tests/${testId}/analytics`);
            return response.data.body || (response.data as any);
        } catch (error: any) {
            console.error('Failed to fetch test analytics:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch test analytics');
        }
    },

    /**
     * Start a test session
     * POST /api/v1/tests/{id}/start
     */
    startSession: async (testId: string, employeeId?: string): Promise<ApiResponse<TestTakeDto>> => {
        try {
            const params = employeeId ? { employeeId } : {};
            const response = await api.post<ApiResponse<TestTakeDto>>(`/api/v1/tests/${testId}/start`, {}, { params });
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
     * Submit all answers at once
     * POST /api/v1/tests/:sessionId/answers-bulk
     */
    submitAnswersBulk: async (sessionId: string, answers: Record<string, string>): Promise<ApiResponse<string>> => {
        try {
            const response = await api.post<ApiResponse<string>>(`/api/v1/tests/${sessionId}/answers-bulk`, { answers });
            return response.data;
        } catch (error: any) {
            console.error('Failed to submit answers in bulk:', error);
            throw new Error(error.response?.data?.message || 'Failed to submit answers');
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

    getResults: async (testId: string): Promise<TestResultsResponseDto> => {
        try {
            const response = await api.get<ApiResponse<TestResultsResponseDto>>(`/api/v1/tests/${testId}/results`);
            return response.data.body || (response.data as any);
        } catch (error: any) {
            console.error('Failed to fetch test results:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch test results');
        }
    },

    /**
     * Get video info for tests
     * GET /api/v1/tests/video-info
     */
    getVideoInfo: async (): Promise<ApiResponse<any>> => {
        try {
            const response = await api.get<ApiResponse<any>>('/api/v1/tests/video-info');
            return response.data;
        } catch (error: any) {
            console.error('Failed to fetch video info:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch video info');
        }
    }

};
