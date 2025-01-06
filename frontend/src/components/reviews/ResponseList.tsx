import React from 'react';
import {
    Box,
    Typography,
    Paper,
    Divider,
    IconButton,
    Stack,
    Chip
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    ThumbUp as ThumbUpIcon
} from '@mui/icons-material';
import { Response, ResponderType } from '../../types/review';
import { getTimeAgo } from '../../utils/dateUtils';

interface ResponseListProps {
    responses: Response[];
    onEdit?: (responseId: string) => void;
    onDelete?: (responseId: string) => void;
    onVoteHelpful?: (responseId: string) => void;
    userType?: ResponderType;
}

const getResponderLabel = (type: ResponderType): { label: string; color: 'primary' | 'secondary' | 'error' } => {
    switch (type) {
        case 'technician':
            return { label: 'Technician', color: 'primary' };
        case 'customer_service':
            return { label: 'Customer Service', color: 'secondary' };
        case 'admin':
            return { label: 'Administrator', color: 'error' };
    }
};

export const ResponseList: React.FC<ResponseListProps> = ({
    responses,
    onEdit,
    onDelete,
    onVoteHelpful,
    userType
}) => {
    return (
        <Stack spacing={2}>
            {responses.map((response) => {
                const responderInfo = getResponderLabel(response.responderType);
                const canModify = userType === 'admin' || 
                    (response.responderType === userType && response.status === 'active');

                return (
                    <Paper
                        key={response.id}
                        elevation={1}
                        sx={{
                            p: 2,
                            backgroundColor: response.status === 'flagged' ? '#fff8e1' : 'white'
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip
                                    label={responderInfo.label}
                                    color={responderInfo.color}
                                    size="small"
                                />
                                <Typography variant="body2" color="text.secondary">
                                    {getTimeAgo(response.createdAt)}
                                </Typography>
                                {response.isEdited && (
                                    <Typography variant="caption" color="text.secondary">
                                        (edited)
                                    </Typography>
                                )}
                            </Box>

                            {canModify && (
                                <Box>
                                    {onEdit && (
                                        <IconButton
                                            size="small"
                                            onClick={() => onEdit(response.id)}
                                            sx={{ mr: 1 }}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                    {onDelete && (
                                        <IconButton
                                            size="small"
                                            onClick={() => onDelete(response.id)}
                                            color="error"
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                </Box>
                            )}
                        </Box>

                        <Typography variant="body1" sx={{ my: 1, whiteSpace: 'pre-wrap' }}>
                            {response.content}
                        </Typography>

                        <Divider sx={{ my: 1 }} />

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton
                                size="small"
                                onClick={() => onVoteHelpful?.(response.id)}
                                color={response.helpfulVotes > 0 ? 'primary' : 'default'}
                            >
                                <ThumbUpIcon fontSize="small" />
                            </IconButton>
                            <Typography variant="body2" color="text.secondary">
                                {response.helpfulVotes} found this helpful
                            </Typography>
                        </Box>
                    </Paper>
                );
            })}

            {responses.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                    No responses yet
                </Typography>
            )}
        </Stack>
    );
}; 