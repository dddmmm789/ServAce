import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Paper,
    Typography,
    Grid,
    IconButton,
    ImageList,
    ImageListItem,
    ImageListItemBar
} from '@mui/material';
import {
    CloudUpload as UploadIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { StarRating } from '../shared/StarRating';

interface ReviewFormProps {
    jobId: string;
    onSubmit: (reviewData: ReviewFormData) => void;
    initialData?: Partial<ReviewFormData>;
    isEditing?: boolean;
}

export interface ReviewFormData {
    rating: number;
    comment: string;
    images: File[];
    existingImages?: string[]; // URLs of existing images when editing
    serviceType?: string;
    location?: string;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
    jobId,
    onSubmit,
    initialData,
    isEditing = false
}) => {
    const [formData, setFormData] = useState<ReviewFormData>({
        rating: initialData?.rating || 0,
        comment: initialData?.comment || '',
        images: [],
        existingImages: initialData?.existingImages || [],
        serviceType: initialData?.serviceType || '',
        location: initialData?.location || ''
    });

    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        const newPreviewUrls = files.map(file => URL.createObjectURL(file));
        
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...files]
        }));
        setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    };

    const handleRemoveImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
        URL.revokeObjectURL(previewUrls[index]);
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleRemoveExistingImage = (url: string) => {
        setFormData(prev => ({
            ...prev,
            existingImages: prev.existingImages?.filter(img => img !== url)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h5" gutterBottom>
                {isEditing ? 'Edit Review' : 'Write a Review'}
            </Typography>
            
            <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                    <StarRating
                        value={formData.rating}
                        onChange={(value) => setFormData(prev => ({ ...prev, rating: value }))}
                        size="large"
                        label="Your Rating"
                    />
                </Box>

                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Your Review"
                    value={formData.comment}
                    onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Share your experience with the service..."
                    sx={{ mb: 3 }}
                />

                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Service Type"
                            value={formData.serviceType}
                            onChange={(e) => setFormData(prev => ({ ...prev, serviceType: e.target.value }))}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Location"
                            value={formData.location}
                            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ mb: 3 }}>
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="image-upload"
                        multiple
                        type="file"
                        onChange={handleImageUpload}
                    />
                    <label htmlFor="image-upload">
                        <Button
                            variant="outlined"
                            component="span"
                            startIcon={<UploadIcon />}
                        >
                            Upload Images
                        </Button>
                    </label>

                    {(previewUrls.length > 0 || formData.existingImages?.length) && (
                        <ImageList sx={{ mt: 2 }} cols={4} rowHeight={164}>
                            {previewUrls.map((url, index) => (
                                <ImageListItem key={url}>
                                    <img src={url} alt={`Review image ${index + 1}`} />
                                    <ImageListItemBar
                                        actionIcon={
                                            <IconButton
                                                sx={{ color: 'white' }}
                                                onClick={() => handleRemoveImage(index)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                    />
                                </ImageListItem>
                            ))}
                            {formData.existingImages?.map((url) => (
                                <ImageListItem key={url}>
                                    <img src={url} alt="Existing review image" />
                                    <ImageListItemBar
                                        actionIcon={
                                            <IconButton
                                                sx={{ color: 'white' }}
                                                onClick={() => handleRemoveExistingImage(url)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
                    )}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                    >
                        {isEditing ? 'Update Review' : 'Submit Review'}
                    </Button>
                </Box>
            </form>
        </Paper>
    );
}; 