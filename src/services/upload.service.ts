import api from '../api/axios';
import type { UploadResponseDto } from '../types/api.types';

export const uploadService = {
    /**
     * Upload file
     * POST /api/v1/upload/api/v1/upload
     */
    upload: async (file: File): Promise<UploadResponseDto> => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post<UploadResponseDto>('/api/v1/upload/api/v1/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error: any) {
            console.error('Failed to upload file:', error);
            throw new Error(error.response?.data?.message || 'Failed to upload file');
        }
    }
};
