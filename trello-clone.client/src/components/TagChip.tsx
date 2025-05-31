import React from 'react';
import { Chip } from '@mui/material';
import { TagColor } from '../features/kanban/utils/tagUtils';

interface TagChipProps {
  name: string;
  color: TagColor;
  selected?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  size?: 'small' | 'medium';
}

const TagChip: React.FC<TagChipProps> = ({ 
  name, 
  color, 
  selected, 
  onClick, 
  onDelete,
  size = 'small'
}) => (
  <Chip
    label={name}
    color={color}
    onClick={onClick}
    onDelete={onDelete}
    size={size}
    variant={selected ? "outlined" : "filled"}
    sx={{
      border: selected ? '2px solid #1976d2' : 'none',
      cursor: onClick ? 'pointer' : 'default',
    }}
  />
);

export default TagChip;
