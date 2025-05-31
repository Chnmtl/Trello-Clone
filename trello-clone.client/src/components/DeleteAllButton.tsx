import React from 'react';
import { Button, styled } from '@mui/material';

const StyledDeleteAllButton = styled(Button)(({ theme }) => ({
    marginLeft: theme.spacing(2),
    background: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
        background: theme.palette.error.dark,
    },
    fontWeight: 700,
    borderRadius: 20,
    boxShadow: theme.shadows[2],
    textTransform: 'none',
    padding: '6px 20px',
}));

interface DeleteAllButtonProps {
    onConfirm: () => void;
    confirmMessage?: string;
    children?: React.ReactNode;
}

const DeleteAllButton: React.FC<DeleteAllButtonProps> = ({ 
    onConfirm, 
    confirmMessage = 'Are you sure you want to delete all tasks?',
    children = 'Delete All Tasks'
}) => {
    const handleClick = () => {
        if (window.confirm(confirmMessage)) {
            onConfirm();
        }
    };

    return (
        <StyledDeleteAllButton variant="contained" onClick={handleClick}>
            {children}
        </StyledDeleteAllButton>
    );
};

export default DeleteAllButton;
