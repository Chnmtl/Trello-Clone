import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Box, Paper, Typography, Card, CardContent } from '@mui/material';

interface Task {
    id: string;
    content: string;
}

interface Column {
    id: string;
    title: string;
    tasks: Task[];
}

const KanbanBoard = () => {
    const [columns, setColumns] = useState<Column[]>([
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
    ]);

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

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Box
                display="flex"
                gap={2}
                p={2}
                sx={{ minHeight: '100vh', backgroundColor: '#f0f0f0' }}
            >
                {columns.map((column) => (
                    <Paper
                        key={column.id}
                        sx={{ width: 300, p: 2, borderRadius: 2 }}
                    >
                        <Typography variant="h6" gutterBottom>
                            {column.title}
                        </Typography>
                        <Droppable droppableId={column.id}>
                            {(provided) => (
                                <Box
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    sx={{ minHeight: 200 }}
                                >
                                    {column.tasks.map((task, index) => (
                                        <Draggable key={task.id} draggableId={task.id} index={index}>
                                            {(provided) => (
                                                <Card
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    sx={{ mb: 1, cursor: 'grab' }}
                                                >
                                                    <CardContent>
                                                        <Typography>{task.content}</Typography>
                                                    </CardContent>
                                                </Card>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </Box>
                            )}
                        </Droppable>
                    </Paper>
                ))}
            </Box>
        </DragDropContext>
    );
};

export default KanbanBoard;