import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import React from 'react';

const StyledDeleteButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  background: theme.palette.primary.main,
  borderRadius: '50%',
  boxShadow: theme.shadows[1],
  transition: 'background 0.2s, color 0.2s',
  '&:hover': {
    background: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
}));

const DeleteIconButton: React.FC<IconButtonProps & { iconSize?: 'small' | 'medium' | 'large' }> = ({
  iconSize = 'small',
  ...props
}) => (
  <StyledDeleteButton {...props}>
    <DeleteIcon fontSize={iconSize} />
  </StyledDeleteButton>
);

export default DeleteIconButton;
