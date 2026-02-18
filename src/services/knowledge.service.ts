import api from '../api/axios';
import type {
    ApiResponse,
    KnowledgeCategoryDto,
    KnowledgeArticleDto,
    KnowledgeArticleVersionDto,
    KnowledgePermissionDto
} from '../types/api.types';

export const knowledgeService = {
    /**
     * Get all categories
     * GET /api/v1/knowledge/categories
     */
    getCategories: async (): Promise<KnowledgeCategoryDto[]> => {
        try {
            const response = await api.get<KnowledgeCategoryDto[]>('/api/v1/knowledge/categories');
            return response.data;
        } catch (error: any) {
            console.error('Failed to fetch categories:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch categories');
        }
    },

    /**
     * Create new category
     * POST /api/v1/knowledge/categories
     */
    createCategory: async (data: KnowledgeCategoryDto): Promise<KnowledgeCategoryDto> => {
        try {
            const response = await api.post<KnowledgeCategoryDto>('/api/v1/knowledge/categories', data);
            return response.data;
        } catch (error: any) {
            console.error('Failed to create category:', error);
            throw new Error(error.response?.data?.message || 'Failed to create category');
        }
    },

    /**
     * Get all articles (optionally filtered by category)
     * GET /api/v1/knowledge/articles
     */
    getArticles: async (categoryId?: string): Promise<ApiResponse<KnowledgeArticleDto[]>> => {
        try {
            const params = categoryId ? { categoryId } : {};
            const response = await api.get<ApiResponse<KnowledgeArticleDto[]>>('/api/v1/knowledge/articles', { params });
            return response.data;
        } catch (error: any) {
            console.error('Failed to fetch articles:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch articles');
        }
    },

    /**
     * Create new article
     * POST /api/v1/knowledge/articles
     */
    createArticle: async (data: KnowledgeArticleDto): Promise<KnowledgeArticleDto> => {
        try {
            const response = await api.post<KnowledgeArticleDto>('/api/v1/knowledge/articles', data);
            return response.data;
        } catch (error: any) {
            console.error('Failed to create article:', error);
            throw new Error(error.response?.data?.message || 'Failed to create article');
        }
    },

    /**
     * Update article
     * PUT /api/v1/knowledge/articles/{id}
     */
    updateArticle: async (articleId: string, data: KnowledgeArticleDto): Promise<KnowledgeArticleDto> => {
        try {
            const response = await api.put<KnowledgeArticleDto>(`/api/v1/knowledge/articles/${articleId}`, data);
            return response.data;
        } catch (error: any) {
            console.error('Failed to update article:', error);
            throw new Error(error.response?.data?.message || 'Failed to update article');
        }
    },

    /**
     * Get article versions
     * GET /api/v1/knowledge/articles/{id}/versions
     */
    getVersions: async (articleId: string): Promise<KnowledgeArticleVersionDto[]> => {
        try {
            const response = await api.get<KnowledgeArticleVersionDto[]>(`/api/v1/knowledge/articles/${articleId}/versions`);
            return response.data;
        } catch (error: any) {
            console.error('Failed to fetch article versions:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch article versions');
        }
    },

    /**
     * Set article permissions
     * POST /api/v1/knowledge/permissions
     */
    setPermissions: async (data: KnowledgePermissionDto): Promise<string> => {
        try {
            const response = await api.post<string>('/api/v1/knowledge/permissions', data);
            return response.data;
        } catch (error: any) {
            console.error('Failed to set permissions:', error);
            throw new Error(error.response?.data?.message || 'Failed to set permissions');
        }
    }
};
