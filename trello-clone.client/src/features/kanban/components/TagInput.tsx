import React from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import TagChip from '../../../components/TagChip';
import DeleteIconButton from '../../../components/DeleteIconButton';
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

    return (
        <Box mb={isExpanded ? 8 : 4}>
            <Typography variant="subtitle2" sx={{ mb: isExpanded ? 2 : 1 }}>
                Tags
            </Typography>
            
            {tags.map((tag, idx) => {
                const duplicate = tag.name && 
                    tags.filter((t, i) => 
                        t.name.trim().toLowerCase() === tag.name.trim().toLowerCase() && i !== idx
                    ).length > 0;

                return isExpanded ? (
                    // Expanded layout for edit modal
                    <Box
                        key={idx}
                        display="flex"
                        alignItems="center"
                        mb={2}
                        sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            p: 2,
                            gap: 2,
                            background: theme => theme.palette.background.default,
                        }}
                    >
                        <Box display="flex" flex={1} alignItems="center" gap={2}>
                            <Box display="flex" alignItems="center" justifyContent="center" height="100%" sx={{ minHeight: 56 }}>
                                <TextField
                                    label="Tag Name"
                                    value={tag.name}
                                    onChange={(e) => onUpdateTag(idx, { name: e.target.value })}
                                    size="small"
                                    sx={{ width: 120, my: 0 }}
                                    error={!!duplicate}
                                    helperText={duplicate ? 'Duplicate tag name' : ' '}
                                    disabled={disabled}
                                />
                            </Box>
                            <Box 
                                display="grid" 
                                gridTemplateColumns="repeat(5, 1fr)" 
                                gridTemplateRows="repeat(2, 1fr)" 
                                gap={1} 
                                alignItems="center" 
                                mr={2}
                            >
                                {TAG_COLORS.map(color => (
                                    <TagChip
                                        key={color}
                                        name={tag.name || 'TAG'}
                                        color={color}
                                        selected={tag.color === color}
                                        onClick={() => !disabled && onUpdateTag(idx, { color })}
                                        style={{ 
                                            cursor: disabled ? 'default' : 'pointer', 
                                            opacity: tag.color === color ? 1 : 0.7, 
                                            border: tag.color === color ? '2px solid #1976d2' : '2px solid #fff' 
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                        <DeleteIconButton
                            onClick={() => onRemoveTag(idx)}
                            aria-label="delete-tag"
                            iconSize="small"
                            disabled={disabled}
                            sx={{ 
                                ml: 1, 
                                minWidth: 32, 
                                minHeight: 32, 
                                width: 32, 
                                height: 32, 
                                borderRadius: '50%' 
                            }}
                        />
                    </Box>
                ) : (
                    // Compact layout for add modal
                    <Box key={idx} display="flex" alignItems="center" mb={1} gap={1}>
                        <TextField
                            label="Tag Name"
                            value={tag.name}
                            onChange={(e) => onUpdateTag(idx, { name: e.target.value })}
                            size="small"
                            sx={{ width: 100 }}
                            error={!!duplicate}
                            helperText={duplicate ? 'Duplicate tag name' : ' '}
                            disabled={disabled}
                        />
                        <Box display="flex" gap={0.5}>
                            {TAG_COLORS.map(color => (
                                <TagChip
                                    key={color}
                                    name={tag.name || 'TAG'}
                                    color={color}
                                    selected={tag.color === color}
                                    onClick={() => !disabled && onUpdateTag(idx, { color })}
                                    style={{ 
                                        cursor: disabled ? 'default' : 'pointer', 
                                        opacity: tag.color === color ? 1 : 0.7, 
                                        border: tag.color === color ? '2px solid #1976d2' : '2px solid #fff' 
                                    }}
                                />
                            ))}
                        </Box>
                        <Button 
                            size="small" 
                            color="error" 
                            onClick={() => onRemoveTag(idx)}
                            disabled={disabled}
                        >
                            Remove
                        </Button>
                    </Box>
                );
            })}
            
            {tags.length === 0 && (
                <Button
                    size="small"
                    variant="outlined"
                    onClick={onAddTag}
                    disabled={disabled || hasDuplicates || tags.some(t => !t.name.trim())}
                >
                    Add Tag
                </Button>
            )}
            
            {hasDuplicates && (
                <Typography color="error" variant="caption">
                    Duplicate tag names are not allowed.
                </Typography>
            )}
        </Box>
    );
};

export default TagInput;
