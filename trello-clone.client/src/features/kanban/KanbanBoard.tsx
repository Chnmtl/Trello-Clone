import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Box, Paper, Typography, Card, CardContent, IconButton, TextField } from '@mui/material';
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
    height: '100%',
}));

const AddTaskBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    marginTop: 'auto',
    position: 'relative',
    minHeight: 120,
}));

const TasksBox = styled(Box)({
    minHeight: 200,
    flexGrow: 1,
    marginBottom: 8,
    overflowY: 'auto',
});

const TaskCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(1),
    cursor: 'grab',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.palette.background.default,
}));

const TaskCardContent = styled(CardContent)({
    flexGrow: 1,
});

const KanbanBoard = () => {
    const [columns, setColumns] = useState<Column[]>(() => {
        const saved = localStorage.getItem('kanban-columns');
        if (saved) return JSON.parse(saved);
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
    });
    const [newTasks, setNewTasks] = useState<{ [columnId: string]: { name: string; description: string } }>({});

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

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <BoardContainer>
                {columns.map((column) => (
                    <ColumnPaper key={column.id}>
                        <Typography variant="h6" gutterBottom>
                            {column.title}
                        </Typography>
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
                                                >
                                                    <TaskCardContent>
                                                        <Typography fontWeight="bold">{task.name}</Typography>
                                                        <Typography variant="body2" color="text.secondary">{task.description}</Typography>
                                                    </TaskCardContent>
                                                    <IconButton onClick={() => handleDeleteTask(column.id, task.id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TaskCard>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </TasksBox>
                            )}
                        </Droppable>
                        <AddTaskBox>
                            <TextField
                                size="small"
                                variant="outlined"
                                placeholder="Name"
                                value={newTasks[column.id]?.name || ''}
                                onChange={e => setNewTasks(tasks => ({ ...tasks, [column.id]: { ...tasks[column.id], name: e.target.value } }))}
                                fullWidth
                                sx={{ mb: 1 }}
                            />
                            <TextField
                                size="small"
                                variant="outlined"
                                placeholder="Description"
                                value={newTasks[column.id]?.description || ''}
                                onChange={e => setNewTasks(tasks => ({ ...tasks, [column.id]: { ...tasks[column.id], description: e.target.value } }))}
                                fullWidth
                                multiline
                                minRows={2}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                <Fab color="primary" size="small" onClick={() => handleAddTask(column.id)} aria-label="add">
                                    <AddIcon />
                                </Fab>
                            </Box>
                        </AddTaskBox>
                    </ColumnPaper>
                ))}
            </BoardContainer>
        </DragDropContext>
    );
};

export default KanbanBoard;