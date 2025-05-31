import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Draggable } from '@hello-pangea/dnd';
import { styled } from '@mui/material/styles';
import DeleteIconButton from '../../../components/DeleteIconButton';
import { Task } from '../types';
import { TagColor } from '../utils/tagUtils';

// Convert Material-UI color names to CSS colors for the ribbon
const getColorValue = (color: TagColor): string => {
    const colorMap: Record<TagColor, string> = {
        'primary': '#1976d2',
        'secondary': '#dc004e', 
        'success': '#2e7d32',
        'error': '#d32f2f',
        'warning': '#ed6c02',
        'info': '#0288d1',
        'default': '#616161'
    };
    return colorMap[color] || colorMap.default;
};

const StyledTaskCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(1),
    cursor: 'grab',
    display: 'flex',
    alignItems: 'flex-start',
    backgroundColor: theme.palette.background.default,
    position: 'relative',
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(1),
}));

const TaskCardContent = styled(CardContent)({
    flexGrow: 1,
    paddingBottom: 8,
});

const TagRibbon = styled('div')<{ bgcolor: string }>(({ bgcolor }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    background: bgcolor,
    height: 36,
    width: 120,
    borderRadius: 6,
    boxShadow: '0 4px 16px 0 rgba(0,0,0,0.25)',
    transform: 'rotate(-45deg) translate(-32px, -16px)',
    transformOrigin: 'top left',
    zIndex: 20,
    pointerEvents: 'none',
}));

interface TaskCardProps {
    task: Task;
    index: number;
    onEdit: (task: Task) => void;
    onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index, onEdit, onDelete }) => {
    return (
        <Draggable key={task.id} draggableId={task.id} index={index}>
            {(provided) => (
                <StyledTaskCard
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={(e) => {
                        if ((e.target as HTMLElement).closest('button')) return;
                        onEdit(task);
                    }}
                >
                    {task.tags && task.tags.length > 0 && (
                        <TagRibbon bgcolor={getColorValue(task.tags[0].color as TagColor)} />
                    )}
                    <TaskCardContent>
                        <Typography fontWeight="bold">{task.name}</Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 5,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            {task.description}
                        </Typography>
                    </TaskCardContent>
                    <DeleteIconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(task.id);
                        }}
                        aria-label="delete-task"
                        iconSize="small"
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            minWidth: 28,
                            minHeight: 28,
                            width: 28,
                            height: 28,
                        }}
                    />
                </StyledTaskCard>
            )}
        </Draggable>
    );
};

export default TaskCard;
