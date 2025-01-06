import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3003';
const api = axios.create({ baseURL: API_BASE_URL });

export interface UploadResponse {
    url: string;
    key: string;
}

export const storageService = {
    // Upload a single file
    uploadFile: async (file: File, folder: string = 'general'): Promise<UploadResponse> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const { data } = await api.post<UploadResponse>('/storage/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    },

    // Upload multiple files
    uploadFiles: async (files: File[], folder: string = 'general'): Promise<UploadResponse[]> => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });
        formData.append('folder', folder);

        const { data } = await api.post<UploadResponse[]>('/storage/upload-multiple', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    },

    // Delete a file
    deleteFile: async (fileKey: string): Promise<void> => {
        await api.delete(`/storage/delete/${fileKey}`);
    },

    // Get a signed URL for temporary access
    getSignedUrl: async (fileKey: string, expiryMinutes: number = 60): Promise<string> => {
        const { data } = await api.get<{ url: string }>(`/storage/signed-url/${fileKey}`, {
            params: { expiryMinutes },
        });
        return data.url;
    },

    // Get public URL for a file
    getPublicUrl: (fileKey: string): string => {
        const spaceEndpoint = process.env.REACT_APP_DO_SPACES_ENDPOINT;
        const spaceBucket = process.env.REACT_APP_DO_SPACES_BUCKET;
        return `https://${spaceBucket}.${spaceEndpoint}/${fileKey}`;
    }
}; 