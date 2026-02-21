import api from '../api/axios';
import type { RolePermissionDto } from '../types/api.types';

export const permissionService = {
    /**
     * Get all role permissions
     * GET /api/v1/admin/permissions
     */
    getAll: async (): Promise<RolePermissionDto[]> => {
        try {
            const response = await api.get<RolePermissionDto[]>('/admin/permissions');
            return response.data;
        } catch (error: any) {
            console.error('Failed to fetch permissions:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch permissions');
        }
    },

    /**
     * Update role permissions
     * PUT /api/v1/admin/permissions/{role}
     */
    update: async (role: string, data: RolePermissionDto): Promise<RolePermissionDto> => {
        try {
            const response = await api.put<RolePermissionDto>(`/admin/permissions/${role}`, data);
            return response.data;
        } catch (error: any) {
            console.error('Failed to update permissions:', error);
            throw new Error(error.response?.data?.message || 'Failed to update permissions');
        }
    }
};
