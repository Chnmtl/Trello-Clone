import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Box, Paper, Typography, Card, CardContent, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';

interface Task {
    id: string;
    name: string;
    description: string;
}

interface Column {
    id: string;
    title: string;
    tasks: Task[];
}

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

const TaskCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(1),
    cursor: 'grab',
    display: 'flex',
    alignItems: 'flex-start', // align items to top
    backgroundColor: theme.palette.background.default,
    position: 'relative', // allow absolute positioning inside
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(1),
}));

const TaskCardContent = styled(CardContent)({
    flexGrow: 1,
    paddingBottom: 8, // reduce bottom padding for more space
});

const DeleteButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
    padding: 2, 
    minWidth: 28,
    minHeight: 28,
    width: 28,
    height: 28,
    fontSize: '1rem',
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

const KanbanBoard = () => {
    // On first load, migrate old tasks if needed
    const getInitialColumns = () => {
        const saved = localStorage.getItem('kanban-columns');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Migrate old format if needed
                return parsed.map((col: Column) => ({
                    ...col,
                    tasks: (col.tasks || []).map((task: Task | { id: string; content?: string }) =>
                        'name' in task && 'description' in task
                            ? task
                            : { id: task.id, name: (task as { content?: string }).content || '', description: '' }
                    ),
                }));
            } catch {
                // fallback to default
            }
        }
        return [
            {
                id: 'column-1',
                title: 'To Do',
                tasks: [
                    { id: 'task-1', name: 'Task 1', description: 'Description 1' },
                    { id: 'task-2', name: 'Task 2', description: 'Description 2' },
                    { id: 'task-4', name: 'Task 4', description: 'Description 4' },
                    { id: 'task-5', name: 'Task 5', description: 'Description 5' },
                ],
            },
            {
                id: 'column-2',
                title: 'In Progress',
                tasks: [{ id: 'task-3', name: 'Task 3', description: 'Description 3' }],
            },
            {
                id: 'column-3',
                title: 'Completed',
                tasks: [],
            },
        ];
    };
    const [columns, setColumns] = useState<Column[]>(getInitialColumns);
    const [newTasks, setNewTasks] = useState<{ [columnId: string]: { name: string; description: string } }>({});
    const [modalColumnId, setModalColumnId] = useState<string | null>(null);
    const [editingTask, setEditingTask] = useState<{ columnId: string; task: Task } | null>(null);
    const [editValues, setEditValues] = useState<{ name: string; description: string }>({ name: '', description: '' });
    const [deleteConfirm, setDeleteConfirm] = useState<{ columnId: string; taskId: string } | null>(null);

    // Save to localStorage on columns change
    useEffect(() => {
        localStorage.setItem('kanban-columns', JSON.stringify(columns));
    }, [columns]);

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        if (!destination) return;

        const newColumns = [...columns];
        const sourceColumn = newColumns.find(col => col.id === source.droppableId);
        const destColumn = newColumns.find(col => col.id === destination.droppableId);

        if (sourceColumn && destColumn) {
            const [movedTask] = sourceColumn.tasks.splice(source.index, 1);
            destColumn.tasks.splice(destination.index, 0, movedTask);
            setColumns(newColumns);
        }
    };

    const handleAddTask = (columnId: string) => {
        const name = newTasks[columnId]?.name?.trim();
        const description = newTasks[columnId]?.description?.trim();
        if (!name) return;
        setColumns(cols =>
            cols.map(col =>
                col.id === columnId
                    ? {
                        ...col,
                        tasks: [
                            ...col.tasks,
                            { id: `task-${Date.now()}`, name, description: description || '' },
                        ],
                    }
                    : col
            )
        );
        setNewTasks(tasks => ({ ...tasks, [columnId]: { name: '', description: '' } }));
    };

    const handleDeleteTask = (columnId: string, taskId: string) => {
        setColumns(cols =>
            cols.map(col =>
                col.id === columnId
                    ? { ...col, tasks: col.tasks.filter(t => t.id !== taskId) }
                    : col
            )
        );
    };

    // Edit task handler
    const handleEditTask = () => {
        if (!editingTask) return;
        setColumns(cols =>
            cols.map(col =>
                col.id === editingTask.columnId
                    ? {
                        ...col,
                        tasks: col.tasks.map(t =>
                            t.id === editingTask.task.id
                                ? { ...t, name: editValues.name.trim(), description: editValues.description.trim() }
                                : t
                        ),
                    }
                    : col
            )
        );
        setEditingTask(null);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <BoardContainer>
                {columns.map((column) => (
                    <ColumnPaper key={column.id}>
                        <ColumnHeader>
                            <Typography variant="h6">
                                {column.title}
                            </Typography>
                            <Fab color="primary" size="small"
                                onClick={() => setModalColumnId(column.id)}
                                aria-label="add">
                                <AddIcon />
                            </Fab>
                        </ColumnHeader>
                        <Droppable droppableId={column.id}>
                            {(provided) => (
                                <TasksBox ref={provided.innerRef} {...provided.droppableProps}>
                                    {column.tasks.map((task, index) => (
                                        <Draggable key={task.id} draggableId={task.id} index={index}>
                                            {(provided) => (
                                                <TaskCard
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    onClick={e => {
                                                        // Prevent edit modal from opening when clicking delete
                                                        if ((e.target as HTMLElement).closest('button')) return;
                                                        setEditingTask({ columnId: column.id, task });
                                                        setEditValues({ name: task.name, description: task.description });
                                                    }}
                                                >
                                                    <TaskCardContent>
                                                        <Typography fontWeight="bold">{task.name}</Typography>
                                                        <Typography variant="body2" color="text.secondary">{task.description}</Typography>
                                                    </TaskCardContent>
                                                    <DeleteButton onClick={e => {
                                                        e.stopPropagation();
                                                        setDeleteConfirm({ columnId: column.id, taskId: task.id });
                                                    }}>
                                                        <DeleteIcon fontSize="small" />
                                                    </DeleteButton>
                                                </TaskCard>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </TasksBox>
                            )}
                        </Droppable>
                    </ColumnPaper>
                ))}
            </BoardContainer>
            {/* Add Card Modal */}
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
                        onChange={e => setNewTasks(tasks => ({ ...tasks, [modalColumnId!]: { ...tasks[modalColumnId!], name: e.target.value } }))}
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
                        onChange={e => setNewTasks(tasks => ({ ...tasks, [modalColumnId!]: { ...tasks[modalColumnId!], description: e.target.value } }))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setModalColumnId(null);
                        if (modalColumnId) setNewTasks(tasks => ({ ...tasks, [modalColumnId]: { name: '', description: '' } }));
                    }}>Cancel</Button>
                    <Button variant="contained" onClick={() => {
                        if (modalColumnId) {
                            handleAddTask(modalColumnId);
                            setModalColumnId(null);
                        }
                    }}>Add</Button>
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
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditingTask(null)}>Cancel</Button>
                    <Button variant="contained" onClick={handleEditTask}>Save</Button>
                </DialogActions>
            </Dialog>
            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
                <DialogTitle>Delete Task</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this task?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={() => {
                        if (deleteConfirm) handleDeleteTask(deleteConfirm.columnId, deleteConfirm.taskId);
                        setDeleteConfirm(null);
                    }}>Delete</Button>
                </DialogActions>
            </Dialog>
        </DragDropContext>
    );
};

export default KanbanBoard;