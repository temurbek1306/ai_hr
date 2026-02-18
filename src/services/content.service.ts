import api from '../api/axios';
import type { ContentDto, ContentCreateDto } from '../types/api.types';

export const contentService = {
    /**
     * Get all content
     * GET /api/v1/content
     */
    getAll: async (): Promise<ContentDto[]> => {
        try {
            const response = await api.get<ContentDto[]>('/api/v1/content');
            return response.data;
        } catch (error: any) {
            console.error('Failed to fetch content:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch content');
        }
    },

    /**
     * Create new content
     * POST /api/v1/content
     */
    create: async (data: ContentCreateDto): Promise<ContentDto> => {
        try {
            const response = await api.post<ContentDto>('/api/v1/content', data);
            return response.data;
        } catch (error: any) {
            console.error('Failed to create content:', error);
            throw new Error(error.response?.data?.message || 'Failed to create content');
        }
    }
};
