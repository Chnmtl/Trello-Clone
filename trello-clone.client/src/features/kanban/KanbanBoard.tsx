import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Box, Paper, Typography, Card, CardContent, Fab, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';
import DeleteIconButton from '../../components/DeleteIconButton';
import TagChip from '../../components/TagChip';

interface Tag {
    name: string;
    color: string; // e.g., 'red', 'blue', 'green'
}
interface Task {
    id: string;
    name: string;
    description: string;
    tags?: Tag[];
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
    paddingBottom: 8,
});

const DeleteAllButton = styled(Button)(({ theme }) => ({
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

const TagRibbon = styled('div')<{ bgcolor: string }>(({ bgcolor }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    background: bgcolor,
    height: 36,
    width: 120,
    borderRadius: 6,
    // border removed
    boxShadow: '0 4px 16px 0 rgba(0,0,0,0.25)',
    transform: 'rotate(-45deg) translate(-32px, -16px)',
    transformOrigin: 'top left',
    zIndex: 20,
    pointerEvents: 'none',
}));

const TagLegendContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
    margin: `${theme.spacing(2)} 0`,
    flexWrap: 'wrap',
}));

const DEFAULT_COLUMNS: Column[] = [
    {
        id: 'column-1',
        title: 'To Do',
        tasks: [
            { id: 'task-1', name: 'Fix login bug', description: 'Users cannot log in with Google on mobile devices.', tags: [{ name: 'BUG', color: 'red' }] },
            { id: 'task-2', name: 'Write docs', description: 'Document the new API endpoints for the frontend team.', tags: [{ name: 'DOC', color: 'blue' }] },
            { id: 'task-3', name: 'Design dashboard', description: 'Create a new dashboard layout for analytics.', tags: [{ name: 'UI', color: 'green' }] },
            { id: 'task-4', name: 'Add dark mode', description: 'Implement dark mode toggle in settings.', tags: [{ name: 'UI', color: 'green' }] },
        ],
    },
    {
        id: 'column-2',
        title: 'In Progress',
        tasks: [
            { id: 'task-5', name: 'Refactor auth', description: 'Refactor authentication logic for better maintainability.', tags: [{ name: 'CODE', color: 'brown' }] },
            { id: 'task-6', name: 'Write tests', description: 'Add unit tests for the user service.', tags: [{ name: 'CODE', color: 'brown' }] },
        ],
    },
    {
        id: 'column-3',
        title: 'Completed',
        tasks: [
            { id: 'task-7', name: 'Setup CI', description: 'Continuous integration pipeline for PRs.', tags: [{ name: 'OPS', color: 'orange' }] },
            { id: 'task-8', name: 'Initial setup', description: 'Project structure and dependencies.', tags: [{ name: 'INIT', color: 'purple' }] },
        ],
    },
];

// Helper for migration type guard
function isTaskWithTags(task: unknown): task is Task {
    return typeof task === 'object' && task !== null && 'name' in task && 'description' in task;
}

// Color palette for tags
const TAG_COLORS = [
    '#1976d2', // blue
    '#388e3c', // green
    '#d32f2f', // red
    '#fbc02d', // yellow
    '#7b1fa2', // purple
    '#f57c00', // orange
    '#455a64', // gray
    '#c2185b', // pink
    '#0097a7', // teal
    '#5d4037', // brown
];

const KanbanBoard = () => {
    // For tag input in add/edit modals
    const [tagInput, setTagInput] = useState<{ name: string; color: string }[]>([]);
    const [editTagInput, setEditTagInput] = useState<{ name: string; color: string }[]>([]);

    // On first load, migrate old tasks if needed
    const getInitialColumns = () => {
        const saved = localStorage.getItem('kanban-columns');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Migrate old format if needed
                return parsed.map((col: Column) => ({
                    ...col,
                    tasks: (col.tasks || []).map((task: unknown) => {
                        if (isTaskWithTags(task)) {
                            if ('tags' in task && Array.isArray(task.tags)) {
                                const tags: Array<string | Tag> = task.tags ?? [];
                                return {
                                    ...task,
                                    tags: tags.map(t =>
                                        typeof t === 'string'
                                            ? { name: t.slice(0, 5), color: 'gray' }
                                            : t
                                    ),
                                };
                            } else {
                                return { ...task, tags: [] };
                            }
                        } else if (typeof task === 'object' && task !== null && 'id' in task) {
                            // fallback for very old format
                            const t = task as { id: string; content?: string };
                            return { id: t.id, name: t.content || '', description: '', tags: [] };
                        }
                        return { id: '', name: '', description: '', tags: [] };
                    }),
                }));
            } catch {
                // fallback to default
            }
        }
        return DEFAULT_COLUMNS;
    };
    const [columns, setColumns] = useState<Column[]>(getInitialColumns);
    const [newTasks, setNewTasks] = useState<{ [columnId: string]: { name: string; description: string } }>({});
    const [modalColumnId, setModalColumnId] = useState<string | null>(null);
    const [editingTask, setEditingTask] = useState<{ columnId: string; task: Task } | null>(null);
    const [editValues, setEditValues] = useState<{ name: string; description: string }>({ name: '', description: '' });
    const [deleteConfirm, setDeleteConfirm] = useState<{ columnId: string; taskId: string } | null>(null);
    // Track if user has cleared the board
    const [cleared, setCleared] = useState(false);

    // Save to localStorage on columns change
    useEffect(() => {
        localStorage.setItem('kanban-columns', JSON.stringify(columns));
    }, [columns]);

    // Restore default tasks if all columns are empty
    useEffect(() => {
        if (!cleared && columns.every(col => col.tasks.length === 0)) {
            setColumns(DEFAULT_COLUMNS);
        }
    }, [columns, cleared]);

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

    // Add Task handler with tags
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
                            { id: `task-${Date.now()}`, name, description: description || '', tags: tagInput.map(t => ({ name: t.name, color: t.color })) },
                        ],
                    }
                    : col
            )
        );
        setNewTasks(tasks => ({ ...tasks, [columnId]: { name: '', description: '' } }));
        setTagInput([]);
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
                                ? { ...t, name: editValues.name.trim(), description: editValues.description.trim(), tags: editTagInput.map(tg => ({ name: tg.name, color: tg.color })) }
                                : t
                        ),
                    }
                    : col
            )
        );
        setEditingTask(null);
    };

    // When opening edit modal, set editTagInput
    useEffect(() => {
        if (editingTask) {
            setEditTagInput(editingTask.task.tags ? [...editingTask.task.tags] : []);
        }
    }, [editingTask]);

    // Helper for duplicate tag name detection (case-insensitive, ignores empty)
    function hasDuplicateTagNames(tags: { name: string }[]) {
        const seen = new Set<string>();
        for (const t of tags) {
            if (!t.name.trim()) continue;
            const lower = t.name.trim().toLowerCase();
            if (seen.has(lower)) return true;
            seen.add(lower);
        }
        return false;
    }

    return (
        <>
            {/* Tag Legend and Delete All Button */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <TagLegendContainer>
                    {Array.from(new Set(columns.flatMap(col => col.tasks.flatMap(task => task.tags || []))
                        .map(tag => `${tag.name}|${tag.color}`)))
                        .map(key => {
                            const [name, color] = key.split('|');
                            return (
                                <TagChip key={key} name={name} color={color} style={{ marginRight: 8, marginBottom: 4 }} />
                            );
                        })}
                </TagLegendContainer>
                <DeleteAllButton
                    variant="contained"
                    onClick={() => {
                        if (window.confirm('Are you sure you want to delete all tasks?')) {
                            setColumns(cols => cols.map(col => ({ ...col, tasks: [] })));
                            setCleared(true);
                        }
                    }}
                >
                    Delete All Tasks
                </DeleteAllButton>
            </Box>
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
                                                        {task.tags && task.tags.length > 0 && (
                                                            <TagRibbon bgcolor={task.tags[0].color} />
                                                        )}
                                                        <TaskCardContent>
                                                            <Typography fontWeight="bold">{task.name}</Typography>
                                                            {/* Restrict description to 5 lines in card display (not in modal) */}
                                                            <Typography variant="body2" color="text.secondary" sx={{
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 5,
                                                                WebkitBoxOrient: 'vertical',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                            }}>
                                                                {task.description}
                                                            </Typography>
                                                        </TaskCardContent>
                                                        <DeleteIconButton
                                                            onClick={e => {
                                                                e.stopPropagation();
                                                                setDeleteConfirm({ columnId: column.id, taskId: task.id });
                                                            }}
                                                            aria-label="delete-task"
                                                            iconSize="small"
                                                            sx={{ position: 'absolute', top: 8, right: 8, minWidth: 28, minHeight: 28, width: 28, height: 28 }}
                                                        />
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
            </DragDropContext>
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
                        sx={{ mb: 2 }}
                    />
                    {/* Tags input for add */}
                    <Box mb={4 /* increased bottom margin */}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Tags</Typography>
                        {tagInput.map((tag, idx) => {
                            const duplicate = tag.name && tagInput.filter((t, i) => t.name.trim().toLowerCase() === tag.name.trim().toLowerCase() && i !== idx).length > 0;
                            return (
                                <Box key={idx} display="flex" alignItems="center" mb={1} gap={1}>
                                    <TextField
                                        label="Tag Name"
                                        value={tag.name}
                                        onChange={e => setTagInput(tags => tags.map((t, i) => i === idx ? { ...t, name: e.target.value } : t))}
                                        size="small"
                                        sx={{ width: 100 }}
                                        error={!!duplicate}
                                        helperText={duplicate ? 'Duplicate tag name' : ' '}
                                    />
                                    {/* Color palette as TagChip */}
                                    <Box display="flex" gap={0.5}>
                                        {TAG_COLORS.map(color => (
                                            <TagChip
                                                key={color}
                                                name={tag.name || 'TAG'}
                                                color={color}
                                                selected={tag.color === color}
                                                onClick={() => setTagInput(tags => tags.map((t, i) => i === idx ? { ...t, color } : t))}
                                                style={{ cursor: 'pointer', opacity: tag.color === color ? 1 : 0.7, border: tag.color === color ? '2px solid #1976d2' : '2px solid #fff' }}
                                            />
                                        ))}
                                    </Box>
                                    <Button size="small" color="error" onClick={() => setTagInput(tags => tags.filter((_, i) => i !== idx))}>Remove</Button>
                                </Box>
                            );
                        })}
                        {tagInput.length === 0 && (
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => setTagInput(tags => [...tags, { name: '', color: TAG_COLORS[0] }])}
                                disabled={hasDuplicateTagNames(tagInput) || tagInput.some(t => !t.name.trim())}
                            >Add Tag</Button>
                        )}
                        {hasDuplicateTagNames(tagInput) && (
                            <Typography color="error" variant="caption">Duplicate tag names are not allowed.</Typography>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setModalColumnId(null);
                        if (modalColumnId) setNewTasks(tasks => ({ ...tasks, [modalColumnId]: { name: '', description: '' } }));
                        setTagInput([]);
                    }}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            if (modalColumnId) {
                                handleAddTask(modalColumnId);
                                setModalColumnId(null);
                            }
                        }}
                        disabled={hasDuplicateTagNames(tagInput) || tagInput.some(t => !t.name.trim())}
                    >Add</Button>
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
                    {/* Tags input for edit */}
                    <Box mb={8 /* increased bottom margin */}>
                        <Typography variant="subtitle2" sx={{ mb: 2 }}>Tags</Typography>
                        {editTagInput.map((tag, idx) => {
                            const duplicate = tag.name && editTagInput.filter((t, i) => t.name.trim().toLowerCase() === tag.name.trim().toLowerCase() && i !== idx).length > 0;
                            return (
                                // Main container for tag row
                                <Box key={idx} display="flex" alignItems="center" mb={2} sx={{
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2,
                                    p: 2,
                                    gap: 2,
                                    background: theme => theme.palette.background.default,
                                }}>
                                    {/* Sub-container for tag name and color palette */}
                                    <Box display="flex" flex={1} alignItems="center" gap={2}>
                                        {/* Tag name input */}
                                        <Box display="flex" alignItems="center" justifyContent="center" height="100%" sx={{ minHeight: 56 }}>
                                            <TextField
                                                label="Tag Name"
                                                value={tag.name}
                                                onChange={e => setEditTagInput(tags => tags.map((t, i) => i === idx ? { ...t, name: e.target.value } : t))}
                                                size="small"
                                                sx={{ width: 120, my: 0 }}
                                                error={!!duplicate}
                                                helperText={duplicate ? 'Duplicate tag name' : ' '}
                                            />
                                        </Box>
                                        {/* Color palette as TagChip grid */}
                                        <Box display="grid" gridTemplateColumns="repeat(5, 1fr)" gridTemplateRows="repeat(2, 1fr)" gap={1} alignItems="center" mr={2}>
                                            {TAG_COLORS.map(color => (
                                                <TagChip
                                                    key={color}
                                                    name={tag.name || 'TAG'}
                                                    color={color}
                                                    selected={tag.color === color}
                                                    onClick={() => setEditTagInput(tags => tags.map((t, i) => i === idx ? { ...t, color } : t))}
                                                    style={{ cursor: 'pointer', opacity: tag.color === color ? 1 : 0.7, border: tag.color === color ? '2px solid #1976d2' : '2px solid #fff' }}
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                    {/* Remove icon button, consistent with card delete */}
                                    <DeleteIconButton
                                        onClick={() => setEditTagInput(tags => tags.filter((_, i) => i !== idx))}
                                        aria-label="delete-tag"
                                        iconSize="small"
                                        sx={{ ml: 1, minWidth: 32, minHeight: 32, width: 32, height: 32, borderRadius: '50%' }}
                                    />
                                </Box>
                            );
                        })}
                        {editTagInput.length === 0 && (
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => setEditTagInput(tags => [...tags, { name: '', color: TAG_COLORS[0] }])}
                                disabled={hasDuplicateTagNames(editTagInput) || editTagInput.some(t => !t.name.trim())}
                            >Add Tag</Button>
                        )}
                        {hasDuplicateTagNames(editTagInput) && (
                            <Typography color="error" variant="caption">Duplicate tag names are not allowed.</Typography>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditingTask(null)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleEditTask}
                        disabled={hasDuplicateTagNames(editTagInput) || editTagInput.some(t => !t.name.trim())}
                    >Save</Button>
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
        </>
    );
};

export default KanbanBoard;
