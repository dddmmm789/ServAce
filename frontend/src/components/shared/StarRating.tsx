import React from 'react';
import { Rating, Box, Typography } from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';

interface StarRatingProps {
    value: number;
    onChange?: (value: number) => void;
    readOnly?: boolean;
    size?: 'small' | 'medium' | 'large';
    showLabel?: boolean;
    label?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
    value,
    onChange,
    readOnly = false,
    size = 'medium',
    showLabel = true,
    label = 'Rating'
}) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {showLabel && (
                <Typography component="legend" sx={{ minWidth: '60px' }}>
                    {label}
                </Typography>
            )}
            <Rating
                value={value}
                onChange={(_, newValue) => {
                    if (newValue !== null && onChange) {
                        onChange(newValue);
                    }
                }}
                readOnly={readOnly}
                size={size}
                icon={<StarIcon fontSize="inherit" />}
                emptyIcon={<StarIcon fontSize="inherit" />}
                precision={1}
                sx={{
                    '& .MuiRating-iconFilled': {
                        color: '#FFB400',
                    },
                    '& .MuiRating-iconEmpty': {
                        color: '#E0E0E0',
                    }
                }}
            />
            {!readOnly && (
                <Typography variant="body2" color="text.secondary">
                    {value} out of 5
                </Typography>
            )}
        </Box>
    );
}; 