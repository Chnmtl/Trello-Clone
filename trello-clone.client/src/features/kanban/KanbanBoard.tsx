import { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Box, Paper, Typography, Fab, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';
import TaskCard from './components/TaskCard';
import TagInput from './components/TagInput';
import TagLegend from './components/TagLegend';
import DeleteAllButton from '../../components/DeleteAllButton';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useKanbanData } from './hooks/useKanbanData';
import { useTagInput } from './hooks/useTagInput';
import { TAG_COLORS } from './utils/tagUtils';
import { Task, DeleteConfirmation, EditingTask, TaskFormData } from './types';

const BoardContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(3),
    padding: theme.spacing(3),
    minHeight: '80vh',
    height: '80vh',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'transparent',
}));

const ColumnPaper = styled(Paper)(({ theme }) => ({
    flex: 1,
    minWidth: 320,
    maxWidth: 400,
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    height: 'fit-content',
    maxHeight: '100%',
}));

const ColumnHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
}));

const TasksBox = styled(Box)(({ theme }) => ({
    minHeight: 200,
    maxHeight: 'calc(80vh - 120px)',
    overflowY: 'auto',
    flex: 1,
    // Custom scrollbar styles
    scrollbarWidth: 'thin', // Firefox
    scrollbarColor: `${theme.palette.primary.main} ${theme.palette.background.paper}`,
    '&::-webkit-scrollbar': {
        width: 8,
        background: theme.palette.background.paper,
        borderRadius: 4,
    },
    '&::-webkit-scrollbar-thumb': {
        background: theme.palette.primary.main,
        borderRadius: 4,
        minHeight: 24,
    },
    '&::-webkit-scrollbar-thumb:hover': {
        background: theme.palette.primary.dark,
    },
    '&::-webkit-scrollbar-corner': {
        background: 'transparent',
    },
}));

const KanbanBoard = () => {
    // Custom hooks for data management
    const { columns, handleDragEnd, addTask, updateTask, deleteTask, clearAllTasks } = useKanbanData();
    
    // Form state
    const [newTasks, setNewTasks] = useState<{ [columnId: string]: TaskFormData }>({});
    const [modalColumnId, setModalColumnId] = useState<string | null>(null);
    const [editingTask, setEditingTask] = useState<EditingTask>(null);
    const [editValues, setEditValues] = useState<TaskFormData>({ name: '', description: '' });
    const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmation>(null);

    // Tag management hooks
    const addTagInput = useTagInput();
    const editTagInput = useTagInput();

    // When opening edit modal, populate the form
    useEffect(() => {
        if (editingTask) {
            setEditValues({ 
                name: editingTask.task.name, 
                description: editingTask.task.description 
            });
            editTagInput.setTags(editingTask.task.tags || []);
        }
    }, [editingTask]);

    const handleAddTask = (columnId: string) => {
        const taskData = newTasks[columnId];
        if (!taskData?.name?.trim()) return;
        
        addTask(columnId, taskData.name, taskData.description || '', addTagInput.tags);
        
        // Reset form
        setNewTasks(tasks => ({ ...tasks, [columnId]: { name: '', description: '' } }));
        addTagInput.clearTags();
        setModalColumnId(null);
    };

    const handleEditTask = () => {
        if (!editingTask) return;
        
        updateTask(
            editingTask.columnId, 
            editingTask.task.id, 
            editValues.name, 
            editValues.description, 
            editTagInput.tags
        );
        
        setEditingTask(null);
    };

    const handleDeleteTask = (columnId: string, taskId: string) => {
        deleteTask(columnId, taskId);
        setDeleteConfirm(null);
    };

    const handleEditClick = (columnId: string, task: Task) => {
        setEditingTask({ columnId, task });
    };

    const handleDeleteClick = (columnId: string, taskId: string) => {
        setDeleteConfirm({ columnId, taskId });
    };

    return (
        <>
            {/* Header with Tag Legend and Delete All Button */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <TagLegend columns={columns} />
                <DeleteAllButton onConfirm={clearAllTasks} />
            </Box>

            <DragDropContext onDragEnd={handleDragEnd}>
                <BoardContainer>
                    {columns.map((column) => (
                        <ColumnPaper key={column.id}>
                            <ColumnHeader>
                                <Typography variant="h6">
                                    {column.title}
                                </Typography>
                                <Fab 
                                    color="primary" 
                                    size="small"
                                    onClick={() => setModalColumnId(column.id)}
                                    aria-label="add"
                                >
                                    <AddIcon />
                                </Fab>
                            </ColumnHeader>
                            <Droppable droppableId={column.id}>
                                {(provided) => (
                                    <TasksBox ref={provided.innerRef} {...provided.droppableProps}>
                                        {column.tasks.map((task, index) => (
                                            <TaskCard
                                                key={task.id}
                                                task={task}
                                                index={index}
                                                onEdit={() => handleEditClick(column.id, task)}
                                                onDelete={() => handleDeleteClick(column.id, task.id)}
                                            />
                                        ))}
                                        {provided.placeholder}
                                    </TasksBox>
                                )}
                            </Droppable>
                        </ColumnPaper>
                    ))}
                </BoardContainer>
            </DragDropContext>

            {/* Add Task Modal */}
            <Dialog open={!!modalColumnId} onClose={() => setModalColumnId(null)}>
                <DialogTitle>Add Card</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        value={modalColumnId ? newTasks[modalColumnId]?.name || '' : ''}
                        onChange={e => setNewTasks(tasks => ({ 
                            ...tasks, 
                            [modalColumnId!]: { 
                                ...tasks[modalColumnId!], 
                                name: e.target.value 
                            } 
                        }))}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        type="text"
                        fullWidth
                        multiline
                        minRows={2}
                        value={modalColumnId ? newTasks[modalColumnId]?.description || '' : ''}
                        onChange={e => setNewTasks(tasks => ({ 
                            ...tasks, 
                            [modalColumnId!]: { 
                                ...tasks[modalColumnId!], 
                                description: e.target.value 
                            } 
                        }))}
                        sx={{ mb: 2 }}
                    />
                    <TagInput
                        tags={addTagInput.tags}
                        onUpdateTag={addTagInput.updateTag}
                        onRemoveTag={addTagInput.removeTag}
                        onAddTag={() => addTagInput.addTag('', TAG_COLORS[0])}
                        hasDuplicates={addTagInput.hasDuplicates}
                        variant="compact"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setModalColumnId(null);
                        if (modalColumnId) {
                            setNewTasks(tasks => ({ 
                                ...tasks, 
                                [modalColumnId]: { name: '', description: '' } 
                            }));
                        }
                        addTagInput.clearTags();
                    }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => modalColumnId && handleAddTask(modalColumnId)}
                        disabled={!addTagInput.isValid}
                    >
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Task Modal */}
            <Dialog open={!!editingTask} onClose={() => setEditingTask(null)}>
                <DialogTitle>Edit Task</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        value={editValues.name}
                        onChange={e => setEditValues(v => ({ ...v, name: e.target.value }))}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        type="text"
                        fullWidth
                        multiline
                        minRows={2}
                        value={editValues.description}
                        onChange={e => setEditValues(v => ({ ...v, description: e.target.value }))}
                        sx={{ mb: 2 }}
                    />
                    <TagInput
                        tags={editTagInput.tags}
                        onUpdateTag={editTagInput.updateTag}
                        onRemoveTag={editTagInput.removeTag}
                        onAddTag={() => editTagInput.addTag('', TAG_COLORS[0])}
                        hasDuplicates={editTagInput.hasDuplicates}
                        variant="expanded"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditingTask(null)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleEditTask}
                        disabled={!editTagInput.isValid}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={!!deleteConfirm}
                title="Delete Task"
                message="Are you sure you want to delete this task?"
                onConfirm={() => {
                    if (deleteConfirm) {
                        handleDeleteTask(deleteConfirm.columnId, deleteConfirm.taskId);
                    }
                }}
                onCancel={() => setDeleteConfirm(null)}
                confirmButtonProps={{ color: 'error', variant: 'contained' }}
            />
        </>
    );
};

export default KanbanBoard;
