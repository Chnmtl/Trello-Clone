import React from 'react';
import { Box, TextField, Button, Typography, IconButton } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import TagChip from '../../../components/TagChip';
import { Tag } from '../types';
import { TAG_COLORS } from '../utils/tagUtils';

interface TagInputProps {
    tags: Tag[];
    onUpdateTag: (index: number, updates: Partial<Tag>) => void;
    onRemoveTag: (index: number) => void;
    onAddTag: () => void;
    hasDuplicates: boolean;
    disabled?: boolean;
    variant?: 'compact' | 'expanded';
}

const MAX_TAG_NAME_LENGTH = 12;

const TagInput: React.FC<TagInputProps> = ({
    tags,
    onUpdateTag,
    onRemoveTag,
    onAddTag,
    hasDuplicates,
    disabled = false,
    variant = 'compact'
}) => {
    const isExpanded = variant === 'expanded';

    const handleTagNameChange = (index: number, value: string) => {
        // Restrict tag name to 12 characters
        if (value.length <= MAX_TAG_NAME_LENGTH) {
            onUpdateTag(index, { name: value });
        }
    };

    const canAddTag = !disabled && !hasDuplicates && !tags.some(t => !t.name.trim());

    return (
        <Box mb={isExpanded ? 3 : 2}>
            {/* Header with Add Tag button */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="subtitle2">
                    Tags
                </Typography>
                <Button
                    size="small"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={onAddTag}
                    disabled={!canAddTag}
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '0.75rem',
                    }}
                >
                    Add Tag
                </Button>
            </Box>
            
            {tags.map((tag, idx) => {
                const duplicate = tag.name && 
                    tags.filter((t, i) => 
                        t.name.trim().toLowerCase() === tag.name.trim().toLowerCase() && i !== idx
                    ).length > 0;

                return isExpanded ? (
                    // Expanded layout for edit modal
                    <Box
                        key={idx}
                        sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            p: 2,
                            mb: 2,
                            background: theme => theme.palette.background.default,
                        }}
                    >
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <TextField
                                label="Tag Name"
                                value={tag.name}
                                onChange={(e) => handleTagNameChange(idx, e.target.value)}
                                size="small"
                                sx={{ width: 140 }}
                                error={!!duplicate}
                                helperText={
                                    duplicate 
                                        ? 'Duplicate tag name' 
                                        : `${tag.name.length}/${MAX_TAG_NAME_LENGTH} characters`
                                }
                                disabled={disabled}
                                inputProps={{ maxLength: MAX_TAG_NAME_LENGTH }}
                            />
                            <IconButton
                                onClick={() => onRemoveTag(idx)}
                                size="small"
                                color="error"
                                disabled={disabled}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                        
                        <Typography variant="caption" color="text.secondary" mb={1} display="block">
                            Choose color:
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                            {TAG_COLORS.map(color => (
                                <TagChip
                                    key={color}
                                    name={tag.name || 'TAG'}
                                    color={color}
                                    selected={tag.color === color}
                                    onClick={() => !disabled && onUpdateTag(idx, { color })}
                                    size="small"
                                />
                            ))}
                        </Box>
                    </Box>
                ) : (
                    // Compact layout for add modal
                    <Box key={idx} sx={{ mb: 2 }}>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <TextField
                                label="Tag Name"
                                value={tag.name}
                                onChange={(e) => handleTagNameChange(idx, e.target.value)}
                                size="small"
                                sx={{ width: 120 }}
                                error={!!duplicate}
                                helperText={
                                    duplicate 
                                        ? 'Duplicate tag name' 
                                        : `${tag.name.length}/${MAX_TAG_NAME_LENGTH}`
                                }
                                disabled={disabled}
                                inputProps={{ maxLength: MAX_TAG_NAME_LENGTH }}
                            />
                            <IconButton
                                onClick={() => onRemoveTag(idx)}
                                size="small"
                                color="error"
                                disabled={disabled}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                        <Box display="flex" gap={0.5} flexWrap="wrap">
                            {TAG_COLORS.map(color => (
                                <TagChip
                                    key={color}
                                    name={tag.name || 'TAG'}
                                    color={color}
                                    selected={tag.color === color}
                                    onClick={() => !disabled && onUpdateTag(idx, { color })}
                                    size="small"
                                />
                            ))}
                        </Box>
                    </Box>
                );
            })}
            
            {hasDuplicates && (
                <Typography color="error" variant="caption">
                    Duplicate tag names are not allowed.
                </Typography>
            )}
        </Box>
    );
};

export default TagInput;
