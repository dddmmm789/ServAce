import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Paper,
    Typography,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    SelectChangeEvent
} from '@mui/material';
import { ResponderType } from '../../types/review';

interface ResponseFormProps {
    reviewId: string;
    onSubmit: (responseData: ResponseFormData) => void;
    initialData?: Partial<ResponseFormData>;
    isEditing?: boolean;
    userType: ResponderType;
}

export interface ResponseFormData {
    content: string;
    responderType: ResponderType;
}

export const ResponseForm: React.FC<ResponseFormProps> = ({
    reviewId,
    onSubmit,
    initialData,
    isEditing = false,
    userType
}) => {
    const [formData, setFormData] = useState<ResponseFormData>({
        content: initialData?.content || '',
        responderType: initialData?.responderType || userType
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Paper elevation={2} sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
                {isEditing ? 'Edit Response' : 'Add Response'}
            </Typography>

            <form onSubmit={handleSubmit}>
                {userType === 'admin' && (
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Responding As</InputLabel>
                        <Select
                            value={formData.responderType}
                            label="Responding As"
                            onChange={(e: SelectChangeEvent) => 
                                setFormData(prev => ({ 
                                    ...prev, 
                                    responderType: e.target.value as ResponderType 
                                }))
                            }
                        >
                            <MenuItem value="technician">Technician</MenuItem>
                            <MenuItem value="customer_service">Customer Service</MenuItem>
                            <MenuItem value="admin">Administrator</MenuItem>
                        </Select>
                    </FormControl>
                )}

                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Your Response"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your response here..."
                    sx={{ mb: 2 }}
                    required
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        {isEditing ? 'Update Response' : 'Submit Response'}
                    </Button>
                </Box>
            </form>
        </Paper>
    );
}; 