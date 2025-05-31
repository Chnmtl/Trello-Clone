import React from 'react';
import { Box } from '@mui/material';
import TagChip from '../../../components/TagChip';
import { extractUniqueTags } from '../utils/tagUtils';
import { Column } from '../types';

interface TagLegendProps {
    columns: Column[];
}

const TagLegend: React.FC<TagLegendProps> = ({ columns }) => {
    const allTasks = columns.flatMap(col => col.tasks);
    const uniqueTags = extractUniqueTags(allTasks);

    if (uniqueTags.length === 0) return null;

    return (
        <Box 
            display="flex" 
            gap={2} 
            alignItems="center" 
            flexWrap="wrap"
            sx={{ margin: 2 }}
        >
            {uniqueTags.map(tag => (
                <TagChip 
                    key={`${tag.name}-${tag.color}`} 
                    name={tag.name} 
                    color={tag.color} 
                    style={{ marginRight: 8, marginBottom: 4 }} 
                />
            ))}
        </Box>
    );
};

export default TagLegend;
