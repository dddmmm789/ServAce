export interface Review {
    id: string;
    jobId: string;
    customerId: string;
    technicianId: string;
    rating: number;
    comment: string;
    status: ReviewStatus;
    responses: Response[];
    images: ReviewImage[];
    metrics: ReviewMetrics;
    serviceDetails?: {
        serviceType?: string;
        serviceDate?: Date;
        location?: string;
        cost?: number;
    };
    isVerifiedPurchase: boolean;
    isEdited: boolean;
    editedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    metadata?: any;
}

export type ReviewStatus = 'pending' | 'approved' | 'flagged' | 'removed';

export interface Response {
    id: string;
    reviewId: string;
    responderId: string;
    responderType: ResponderType;
    content: string;
    status: ResponseStatus;
    helpfulVotes: number;
    isEdited: boolean;
    editedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    metadata?: any;
}

export type ResponderType = 'technician' | 'customer_service' | 'admin';
export type ResponseStatus = 'active' | 'archived' | 'flagged';

export interface ReviewImage {
    id: string;
    reviewId: string;
    url: string;
    caption?: string;
    altText?: string;
    displayOrder: number;
    imageMetadata?: {
        size?: number;
        width?: number;
        height?: number;
        format?: string;
    };
    createdAt: Date;
    updatedAt: Date;
    metadata?: any;
}

export interface ReviewMetrics {
    id: string;
    reviewId: string;
    helpfulVotes: number;
    unhelpfulVotes: number;
    viewCount: number;
    responseCount: number;
    reportCount: number;
    engagementMetrics?: {
        timeSpentReading?: number;
        clickThroughRate?: number;
        shareCount?: number;
    };
    createdAt: Date;
    updatedAt: Date;
    metadata?: any;
} 