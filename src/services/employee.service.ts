import api from '../api/axios';
import type {
    ApiResponse,
    AdminEmployeeDto,
    AdminEmployeeCreateDto,
    EmployeeProfileDto,
    EmployeeSummaryDTO,
    AssignmentDto,
    AssignmentCreateDto
} from '../types/api.types';

export const employeeService = {
    /**
     * Get all employees (Admin only)
     * GET /api/v1/admin/employees
     */
    getAll: async (): Promise<AdminEmployeeDto[]> => {
        try {
            const response = await api.get<ApiResponse<AdminEmployeeDto[]>>('/api/v1/admin/employees');
            return response.data.body || [];
        } catch (error: any) {
            console.error('Failed to fetch employees:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch employees');
        }
    },

    /**
     * Get employee by ID (Admin only)
     * GET /api/v1/admin/employees/{employeeId}
     */
    getById: async (id: string): Promise<AdminEmployeeDto> => {
        try {
            const response = await api.get<ApiResponse<AdminEmployeeDto>>(`/api/v1/admin/employees/${id}`);
            return response.data.body as AdminEmployeeDto;
        } catch (error: any) {
            console.error('Failed to fetch employee:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch employee');
        }
    },


    /**
     * Create new employee (Admin only)
     * POST /api/v1/admin/employees
     */
    create: async (data: AdminEmployeeCreateDto): Promise<AdminEmployeeDto> => {
        try {
            const response = await api.post<ApiResponse<AdminEmployeeDto>>('/api/v1/admin/employees', data);
            return response.data.body as AdminEmployeeDto;
        } catch (error: any) {
            console.error('Failed to create employee:', error);
            throw new Error(error.response?.data?.message || 'Failed to create employee');
        }
    },

    /**
     * Update employee (Admin only)
     * PUT /api/v1/admin/employees/{employeeId}
     */
    update: async (id: string, data: AdminEmployeeCreateDto): Promise<AdminEmployeeDto> => {
        try {
            const response = await api.put<ApiResponse<AdminEmployeeDto>>(`/api/v1/admin/employees/${id}`, data);
            return response.data.body as AdminEmployeeDto;
        } catch (error: any) {
            console.error('Failed to update employee:', error);
            throw new Error(error.response?.data?.message || 'Failed to update employee');
        }
    },


    /**
     * Delete employee (Admin only)
     * DELETE /api/v1/admin/employees/{employeeId}
     */
    delete: async (id: string): Promise<void> => {
        try {
            await api.delete(`/api/v1/admin/employees/${id}`);
        } catch (error: any) {
            console.error('Failed to delete employee:', error);
            throw new Error(error.response?.data?.message || 'Failed to delete employee');
        }
    },


    /**
     * Import employees from file (Admin only)
     * POST /api/v1/employees/import
     */
    importEmployees: async (file: File): Promise<ApiResponse<any>> => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await api.post<ApiResponse<any>>('/api/v1/admin/employees/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error: any) {
            console.error('Failed to import employees:', error);
            throw new Error(error.response?.data?.message || 'Failed to import employees');
        }
    },

    /**
     * Export employees to CSV (Admin only)
     * GET /api/v1/employees/export
     */
    exportEmployees: async (): Promise<Blob> => {
        try {
            const response = await api.get('/api/v1/admin/employees/export', {
                responseType: 'blob',
            });
            return response.data;
        } catch (error: any) {
            console.error('Failed to export employees:', error);
            throw new Error(error.response?.data?.message || 'Failed to export employees');
        }
    },

    /**
     * Get employee status
     * GET /api/v1/employees/{employeeId}/status
     */
    getStatus: async (id: string): Promise<ApiResponse<any>> => {
        try {
            const response = await api.get<ApiResponse<any>>(`/api/v1/employees/${id}/status`);
            return response.data;
        } catch (error: any) {
            console.error('Failed to fetch employee status:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch employee status');
        }
    },

    /**
     * Get employee profile
     * GET /api/v1/employees/{employeeId}/profile
     */
    getProfile: async (id: string): Promise<EmployeeProfileDto> => {
        try {
            const response = await api.get<ApiResponse<EmployeeProfileDto>>(`/api/v1/employees/${id}/profile`);
            return response.data.body as EmployeeProfileDto;
        } catch (error: any) {
            console.error('Failed to fetch employee profile:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch employee profile');
        }
    },

    /**
     * Get employee summary with test results
     * GET /api/v1/employees/{employeeId}/summary
     */
    getSummary: async (id: string): Promise<EmployeeSummaryDTO> => {
        try {
            const response = await api.get<ApiResponse<EmployeeSummaryDTO>>(`/api/v1/employees/${id}/summary`);
            return response.data.body as EmployeeSummaryDTO;
        } catch (error: any) {
            console.error('Failed to fetch employee summary:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch employee summary');
        }
    },

    /**
     * Get employee assignments
     * GET /api/v1/employees/{employeeId}/assignments
     */
    getAssignments: async (id: string): Promise<AssignmentDto[]> => {
        try {
            const response = await api.get<ApiResponse<AssignmentDto[]>>(`/api/v1/employees/${id}/assignments`);
            return response.data.body || [];
        } catch (error: any) {
            console.error('Failed to fetch assignments:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch assignments');
        }
    },


    /**
     * Create assignment for employee
     * POST /api/v1/admin/employees/{employeeId}/assignments
     */
    createAssignment: async (id: string, data: AssignmentCreateDto): Promise<AssignmentDto> => {
        try {
            const response = await api.post<ApiResponse<AssignmentDto>>(`/api/v1/admin/employees/${id}/assignments`, data);
            return response.data.body as AssignmentDto;
        } catch (error: any) {
            console.error('Failed to create assignment:', error);
            throw new Error(error.response?.data?.message || 'Failed to create assignment');
        }
    },

    /**
     * Cleanup ghost employees
     * POST /api/v1/admin/employees/cleanup-ghosts
     */
    cleanupGhosts: async (): Promise<ApiResponse<void>> => {
        try {
            const response = await api.post<ApiResponse<void>>('/api/v1/admin/employees/cleanup-ghosts');
            return response.data;
        } catch (error: any) {
            console.error('Failed to cleanup ghosts:', error);
            throw new Error(error.response?.data?.message || 'Failed to cleanup ghosts');
        }
    }

};
