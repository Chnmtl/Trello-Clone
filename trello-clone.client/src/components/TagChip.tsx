import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface TagChipProps {
  name: string;
  color: string;
  selected?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

const ChipContainer = styled(Box)<{ bgcolor: string; selected?: boolean }>(({ theme, bgcolor, selected }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '0 12px',
  height: 32,
  borderRadius: 16,
  background: bgcolor,
  color: theme.palette.getContrastText(bgcolor),
  fontWeight: 600,
  fontSize: 14,
  boxShadow: selected ? `0 0 0 2px ${theme.palette.primary.main}` : theme.shadows[1],
  border: selected ? `2px solid ${theme.palette.primary.main}` : 'none',
  cursor: 'pointer',
  transition: 'box-shadow 0.2s, border 0.2s',
  userSelect: 'none',
}));

const TagChip: React.FC<TagChipProps> = ({ name, color, selected, onClick, style, className }) => (
  <ChipContainer bgcolor={color} selected={selected} onClick={onClick} style={style} className={className}>
    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 14, lineHeight: 1 }}>{name}</Typography>
  </ChipContainer>
);

export default TagChip;
