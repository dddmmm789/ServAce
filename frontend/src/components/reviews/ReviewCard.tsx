import React from 'react';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Box,
    Button,
    Chip,
    IconButton,
    Divider
} from '@mui/material';
import {
    ThumbUp as ThumbUpIcon,
    ThumbDown as ThumbDownIcon,
    Flag as FlagIcon
} from '@mui/icons-material';
import { StarRating } from '../shared/StarRating';
import { Review } from '../../types/review';
import { formatDate } from '../../utils/dateUtils';

interface ReviewCardProps {
    review: Review;
    onVoteHelpful?: (reviewId: string) => void;
    onVoteUnhelpful?: (reviewId: string) => void;
    onReport?: (reviewId: string) => void;
    onRespond?: (reviewId: string) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
    review,
    onVoteHelpful,
    onVoteUnhelpful,
    onReport,
    onRespond
}) => {
    return (
        <Card sx={{ mb: 2, boxShadow: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                        <StarRating value={review.rating} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary">
                            {formatDate(review.createdAt)}
                        </Typography>
                    </Box>
                    <Box>
                        {review.isVerifiedPurchase && (
                            <Chip
                                label="Verified Purchase"
                                color="primary"
                                size="small"
                                sx={{ mr: 1 }}
                            />
                        )}
                        <Chip
                            label={review.status}
                            color={review.status === 'approved' ? 'success' : 'default'}
                            size="small"
                        />
                    </Box>
                </Box>

                <Typography variant="body1" sx={{ mb: 2 }}>
                    {review.comment}
                </Typography>

                {review.serviceDetails && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Service Details:
                        </Typography>
                        <Typography variant="body2">
                            {review.serviceDetails.serviceType} - {review.serviceDetails.location}
                        </Typography>
                    </Box>
                )}

                {review.images && review.images.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, overflowX: 'auto' }}>
                        {review.images.map((image) => (
                            <Box
                                key={image.id}
                                component="img"
                                src={image.url}
                                alt={image.altText || 'Review image'}
                                sx={{
                                    width: 100,
                                    height: 100,
                                    objectFit: 'cover',
                                    borderRadius: 1
                                }}
                            />
                        ))}
                    </Box>
                )}

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        Was this review helpful?
                    </Typography>
                    <IconButton
                        size="small"
                        onClick={() => onVoteHelpful?.(review.id)}
                        color={review.metrics.helpfulVotes > 0 ? 'primary' : 'default'}
                    >
                        <ThumbUpIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="body2">{review.metrics.helpfulVotes}</Typography>
                    
                    <IconButton
                        size="small"
                        onClick={() => onVoteUnhelpful?.(review.id)}
                        color={review.metrics.unhelpfulVotes > 0 ? 'error' : 'default'}
                    >
                        <ThumbDownIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="body2">{review.metrics.unhelpfulVotes}</Typography>
                </Box>
            </CardContent>

            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Button
                    size="small"
                    variant="outlined"
                    onClick={() => onRespond?.(review.id)}
                >
                    Respond
                </Button>
                <IconButton
                    size="small"
                    color="warning"
                    onClick={() => onReport?.(review.id)}
                >
                    <FlagIcon fontSize="small" />
                </IconButton>
            </CardActions>
        </Card>
    );
}; 