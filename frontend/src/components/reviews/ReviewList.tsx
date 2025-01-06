import React, { useState, useMemo } from 'react';
import {
    Box,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography,
    Grid,
    Pagination,
    SelectChangeEvent,
    Stack
} from '@mui/material';
import { ReviewCard } from './ReviewCard';
import { Review, ReviewStatus } from '../../types/review';

interface ReviewListProps {
    reviews: Review[];
    onVoteHelpful: (reviewId: string) => void;
    onVoteUnhelpful: (reviewId: string) => void;
    onReport: (reviewId: string) => void;
    onRespond: (reviewId: string) => void;
}

type SortOption = 'newest' | 'oldest' | 'highest-rating' | 'lowest-rating' | 'most-helpful';

export const ReviewList: React.FC<ReviewListProps> = ({
    reviews,
    onVoteHelpful,
    onVoteUnhelpful,
    onReport,
    onRespond
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<ReviewStatus | 'all'>('all');
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    const filteredAndSortedReviews = useMemo(() => {
        let filtered = reviews;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(review =>
                review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                review.serviceDetails?.serviceType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                review.serviceDetails?.location?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(review => review.status === statusFilter);
        }

        // Apply sorting
        return filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case 'oldest':
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case 'highest-rating':
                    return b.rating - a.rating;
                case 'lowest-rating':
                    return a.rating - b.rating;
                case 'most-helpful':
                    return b.metrics.helpfulVotes - a.metrics.helpfulVotes;
                default:
                    return 0;
            }
        });
    }, [reviews, searchTerm, statusFilter, sortBy]);

    const paginatedReviews = useMemo(() => {
        const startIndex = (page - 1) * itemsPerPage;
        return filteredAndSortedReviews.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredAndSortedReviews, page]);

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Box>
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="Search Reviews"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by comment, service type, or location"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                        <InputLabel>Filter by Status</InputLabel>
                        <Select
                            value={statusFilter}
                            label="Filter by Status"
                            onChange={(e: SelectChangeEvent) => setStatusFilter(e.target.value as ReviewStatus | 'all')}
                        >
                            <MenuItem value="all">All Reviews</MenuItem>
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="approved">Approved</MenuItem>
                            <MenuItem value="flagged">Flagged</MenuItem>
                            <MenuItem value="removed">Removed</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                        <InputLabel>Sort By</InputLabel>
                        <Select
                            value={sortBy}
                            label="Sort By"
                            onChange={(e: SelectChangeEvent) => setSortBy(e.target.value as SortOption)}
                        >
                            <MenuItem value="newest">Newest First</MenuItem>
                            <MenuItem value="oldest">Oldest First</MenuItem>
                            <MenuItem value="highest-rating">Highest Rating</MenuItem>
                            <MenuItem value="lowest-rating">Lowest Rating</MenuItem>
                            <MenuItem value="most-helpful">Most Helpful</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="text.secondary">
                    Showing {paginatedReviews.length} of {filteredAndSortedReviews.length} reviews
                </Typography>
            </Box>

            <Stack spacing={2}>
                {paginatedReviews.map((review) => (
                    <ReviewCard
                        key={review.id}
                        review={review}
                        onVoteHelpful={onVoteHelpful}
                        onVoteUnhelpful={onVoteUnhelpful}
                        onReport={onReport}
                        onRespond={onRespond}
                    />
                ))}
            </Stack>

            {filteredAndSortedReviews.length > itemsPerPage && (
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                    <Pagination
                        count={Math.ceil(filteredAndSortedReviews.length / itemsPerPage)}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                    />
                </Box>
            )}
        </Box>
    );
}; 