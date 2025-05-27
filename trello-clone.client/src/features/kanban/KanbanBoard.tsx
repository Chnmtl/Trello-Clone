import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Box, Paper, Typography, Card, CardContent, IconButton, TextField, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';

interface Task {
    id: string;
    content: string;
}

interface Column {
    id: string;
    title: string;
    tasks: Task[];
}

const BoardContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    minHeight: '100vh',
    backgroundColor: '#f0f0f0',
}));

const ColumnPaper = styled(Paper)(({ theme }) => ({
    width: 300,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
}));

const AddTaskBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
}));

const TasksBox = styled(Box)({
    minHeight: 200,
});

const TaskCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(1),
    cursor: 'grab',
    display: 'flex',
    alignItems: 'center',
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
                    { id: 'task-1', content: 'Task 1' },
                    { id: 'task-2', content: 'Task 2' },
                    { id: 'task-4', content: 'Task 4' },
                    { id: 'task-5', content: 'Task 5' },
                ],
            },
            {
                id: 'column-2',
                title: 'In Progress',
                tasks: [{ id: 'task-3', content: 'Task 3' }],
            },
            {
                id: 'column-3',
                title: 'Completed',
                tasks: [],
            },
        ];
    });
    const [newTasks, setNewTasks] = useState<{ [columnId: string]: string }>({});

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
        const content = newTasks[columnId]?.trim();
        if (!content) return;
        setColumns(cols =>
            cols.map(col =>
                col.id === columnId
                    ? {
                          ...col,
                          tasks: [
                              ...col.tasks,
                              { id: `task-${Date.now()}`, content },
                          ],
                      }
                    : col
            )
        );
        setNewTasks(tasks => ({ ...tasks, [columnId]: '' }));
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
                        <AddTaskBox>
                            <TextField
                                size="small"
                                variant="outlined"
                                placeholder="Add a task"
                                value={newTasks[column.id] || ''}
                                onChange={e => setNewTasks(tasks => ({ ...tasks, [column.id]: e.target.value }))}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') handleAddTask(column.id);
                                }}
                                fullWidth
                            />
                            <Button variant="contained" onClick={() => handleAddTask(column.id)}>
                                Add
                            </Button>
                        </AddTaskBox>
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
                                                        <Typography>{task.content}</Typography>
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
                    </ColumnPaper>
                ))}
            </BoardContainer>
        </DragDropContext>
    );
};

export default KanbanBoard;