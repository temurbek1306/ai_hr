import api from '../api/axios';
import type {
    OnboardingMaterialDTO,
    OnboardingProgressDTO
} from '../types/api.types';

export const onboardingService = {
    /**
     * Get all onboarding materials
     * GET /api/v1/onboarding/materials
     */
    getMaterials: async (): Promise<OnboardingMaterialDTO[]> => {
        try {
            const response = await api.get<OnboardingMaterialDTO[]>('/onboarding/materials');
            return response.data;
        } catch (error: any) {
            console.error('Failed to fetch onboarding materials:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch onboarding materials');
        }
    },

    /**
     * Get onboarding material by ID
     * GET /api/v1/onboarding/materials/{id}
     */
    getMaterialById: async (id: string): Promise<OnboardingMaterialDTO> => {
        try {
            const response = await api.get<OnboardingMaterialDTO>(`/onboarding/materials/${id}`);
            return response.data;
        } catch (error: any) {
            console.error('Failed to fetch onboarding material:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch onboarding material');
        }
    },

    /**
     * Create new onboarding material
     * POST /api/v1/onboarding/materials
     */
    createMaterial: async (data: OnboardingMaterialDTO): Promise<OnboardingMaterialDTO> => {
        try {
            const response = await api.post<OnboardingMaterialDTO>('/onboarding/materials', data);
            return response.data;
        } catch (error: any) {
            console.error('Failed to create onboarding material:', error);
            throw new Error(error.response?.data?.message || 'Failed to create onboarding material');
        }
    },

    /**
     * Update onboarding material
     * PUT /api/v1/onboarding/materials/{id}
     */
    updateMaterial: async (id: string, data: OnboardingMaterialDTO): Promise<OnboardingMaterialDTO> => {
        try {
            const response = await api.put<OnboardingMaterialDTO>(`/onboarding/materials/${id}`, data);
            return response.data;
        } catch (error: any) {
            console.error('Failed to update onboarding material:', error);
            throw new Error(error.response?.data?.message || 'Failed to update onboarding material');
        }
    },

    /**
     * Delete onboarding material
     * DELETE /api/v1/onboarding/materials/{id}
     */
    deleteMaterial: async (id: string): Promise<void> => {
        try {
            await api.delete(`/onboarding/materials/${id}`);
        } catch (error: any) {
            console.error('Failed to delete onboarding material:', error);
            throw new Error(error.response?.data?.message || 'Failed to delete onboarding material');
        }
    },

    /**
     * Get employee onboarding materials
     * GET /api/v1/employees/{id}/onboarding/materials
     */
    getEmployeeMaterials: async (employeeId: string): Promise<OnboardingMaterialDTO[]> => {
        try {
            const response = await api.get<OnboardingMaterialDTO[]>(`/employees/${employeeId}/onboarding/materials`);
            return response.data;
        } catch (error: any) {
            console.error('Failed to fetch employee materials:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch employee materials');
        }
    },

    /**
     * Save onboarding progress
     * POST /api/v1/employees/{id}/onboarding/progress
     */
    saveProgress: async (employeeId: string, progress: OnboardingProgressDTO): Promise<OnboardingProgressDTO> => {
        try {
            const response = await api.post<OnboardingProgressDTO>(`/employees/${employeeId}/onboarding/progress`, progress);
            return response.data;
        } catch (error: any) {
            console.error('Failed to save onboarding progress:', error);
            throw new Error(error.response?.data?.message || 'Failed to save onboarding progress');
        }
    },

    /**
     * Complete onboarding
     * POST /api/v1/employees/{id}/onboarding/complete
     */
    completeOnboarding: async (employeeId: string): Promise<string> => {
        try {
            const response = await api.post<string>(`/employees/${employeeId}/onboarding/complete`);
            return response.data;
        } catch (error: any) {
            console.error('Failed to complete onboarding:', error);
            throw new Error(error.response?.data?.message || 'Failed to complete onboarding');
        }
    }
};
