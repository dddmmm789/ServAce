import axios from 'axios';
import { Review, Response } from '../types/review';
import { ReviewFormData } from '../components/reviews/ReviewForm';
import { ResponseFormData } from '../components/reviews/ResponseForm';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3003';
const api = axios.create({ baseURL: API_BASE_URL });

export const reviewService = {
    // Review Operations
    getReviews: async (filters?: {
        status?: string;
        customerId?: string;
        technicianId?: string;
        jobId?: string;
    }) => {
        const { data } = await api.get<Review[]>('/reviews', { params: filters });
        return data;
    },

    getReviewById: async (reviewId: string) => {
        const { data } = await api.get<Review>(`/reviews/${reviewId}`);
        return data;
    },

    createReview: async (reviewData: ReviewFormData) => {
        const formData = new FormData();
        Object.entries(reviewData).forEach(([key, value]) => {
            if (key === 'images') {
                (value as File[]).forEach(file => {
                    formData.append('images', file);
                });
            } else {
                formData.append(key, value as string);
            }
        });
        const { data } = await api.post<Review>('/reviews', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    },

    updateReview: async (reviewId: string, reviewData: Partial<ReviewFormData>) => {
        const formData = new FormData();
        Object.entries(reviewData).forEach(([key, value]) => {
            if (key === 'images') {
                (value as File[]).forEach(file => {
                    formData.append('images', file);
                });
            } else {
                formData.append(key, value as string);
            }
        });
        const { data } = await api.put<Review>(`/reviews/${reviewId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    },

    deleteReview: async (reviewId: string) => {
        await api.delete(`/reviews/${reviewId}`);
    },

    // Review Response Operations
    getResponses: async (reviewId: string) => {
        const { data } = await api.get<Response[]>(`/reviews/${reviewId}/responses`);
        return data;
    },

    createResponse: async (reviewId: string, responseData: ResponseFormData) => {
        const { data } = await api.post<Response>(
            `/reviews/${reviewId}/responses`,
            responseData
        );
        return data;
    },

    updateResponse: async (
        reviewId: string,
        responseId: string,
        responseData: Partial<ResponseFormData>
    ) => {
        const { data } = await api.put<Response>(
            `/reviews/${reviewId}/responses/${responseId}`,
            responseData
        );
        return data;
    },

    deleteResponse: async (reviewId: string, responseId: string) => {
        await api.delete(`/reviews/${reviewId}/responses/${responseId}`);
    },

    // Voting Operations
    voteHelpfulReview: async (reviewId: string) => {
        const { data } = await api.post<Review>(`/reviews/${reviewId}/vote-helpful`);
        return data;
    },

    voteUnhelpfulReview: async (reviewId: string) => {
        const { data } = await api.post<Review>(`/reviews/${reviewId}/vote-unhelpful`);
        return data;
    },

    voteHelpfulResponse: async (reviewId: string, responseId: string) => {
        const { data } = await api.post<Response>(
            `/reviews/${reviewId}/responses/${responseId}/vote-helpful`
        );
        return data;
    },

    // Reporting Operations
    reportReview: async (reviewId: string, reason: string) => {
        const { data } = await api.post<Review>(`/reviews/${reviewId}/report`, { reason });
        return data;
    },

    reportResponse: async (reviewId: string, responseId: string, reason: string) => {
        const { data } = await api.post<Response>(
            `/reviews/${reviewId}/responses/${responseId}/report`,
            { reason }
        );
        return data;
    }
}; 