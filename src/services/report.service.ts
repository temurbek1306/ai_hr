import api from '../api/axios';
import type {
    ReportDto,
    ReportGenerateDto,
    TestReportResponseDto,
    EmployeeReportResponseDto
} from '../types/api.types';

export const reportService = {
    /**
     * Get all reports
     * GET /api/v1/admin/reports
     */
    getAll: async (): Promise<ReportDto[]> => {
        try {
            const response = await api.get<ReportDto[]>('/admin/reports');
            return response.data;
        } catch (error: any) {
            console.error('Failed to fetch reports:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch reports');
        }
    },

    /**
     * Generate new report
     * POST /api/v1/admin/reports/generate
     */
    generate: async (data: ReportGenerateDto): Promise<ReportDto> => {
        try {
            const response = await api.post<ReportDto>('/admin/reports/generate', data);
            return response.data;
        } catch (error: any) {
            console.error('Failed to generate report:', error);
            throw new Error(error.response?.data?.message || 'Failed to generate report');
        }
    },

    /**
     * Download report
     * GET /api/v1/reports/{id}/download
     */
    downloadReport: async (id: string): Promise<Blob> => {
        try {
            const response = await api.get(`/reports/${id}/download`, {
                responseType: 'blob'
            });
            return response.data;
        } catch (error: any) {
            console.error('Failed to download report:', error);
            throw new Error(error.response?.data?.message || 'Failed to download report');
        }
    },

    /**
     * Get all reports
     * GET /api/v1/reports
     */
    getReports: async (): Promise<any[]> => {
        try {
            const response = await api.get<any[]>('/reports');
            return response.data;
        } catch (error: any) {
            console.error('Failed to fetch reports:', error);
            // Return empty array as fallback
            return [];
        }
    },

    /**
     * Get test reports
     * GET /api/v1/reports/tests
     */
    getTestsReport: async (): Promise<TestReportResponseDto> => {
        try {
            const response = await api.get<TestReportResponseDto>('/reports/tests');
            return response.data;
        } catch (error: any) {
            console.error('Failed to fetch test reports:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch test reports');
        }
    },

    /**
     * Get employee reports
     * GET /api/v1/reports/employees
     */
    getEmployeeReport: async (startDate: string, endDate: string, department?: string): Promise<EmployeeReportResponseDto> => {
        try {
            const params: any = { startDate, endDate };
            if (department) params.department = department;

            const response = await api.get<EmployeeReportResponseDto>('/reports/employees', { params });
            return response.data;
        } catch (error: any) {
            console.error('Failed to fetch employee report:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch employee report');
        }
    }
};
