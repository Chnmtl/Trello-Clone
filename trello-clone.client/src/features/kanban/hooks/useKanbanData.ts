import { useState, useEffect } from 'react';
import { Column, Task, Tag } from '../types';
import { DropResult } from '@hello-pangea/dnd';

const STORAGE_KEY = 'kanban-columns';

const DEFAULT_COLUMNS: Column[] = [
    {
        id: 'column-1',
        title: 'To Do',
        tasks: [
            { id: 'task-1', name: 'Fix login bug', description: 'Users cannot log in with Google on mobile devices.', tags: [{ name: 'BUG', color: '#d32f2f' }] },
            { id: 'task-2', name: 'Write docs', description: 'Document the new API endpoints for the frontend team.', tags: [{ name: 'DOC', color: '#1976d2' }] },
            { id: 'task-3', name: 'Design dashboard', description: 'Create a new dashboard layout for analytics.', tags: [{ name: 'UI', color: '#388e3c' }] },
            { id: 'task-4', name: 'Add dark mode', description: 'Implement dark mode toggle in settings.', tags: [{ name: 'UI', color: '#388e3c' }] },
        ],
    },
    {
        id: 'column-2',
        title: 'In Progress',
        tasks: [
            { id: 'task-5', name: 'Refactor auth', description: 'Refactor authentication logic for better maintainability.', tags: [{ name: 'CODE', color: '#5d4037' }] },
            { id: 'task-6', name: 'Write tests', description: 'Add unit tests for the user service.', tags: [{ name: 'CODE', color: '#5d4037' }] },
        ],
    },
    {
        id: 'column-3',
        title: 'Completed',
        tasks: [
            { id: 'task-7', name: 'Setup CI', description: 'Continuous integration pipeline for PRs.', tags: [{ name: 'OPS', color: '#f57c00' }] },
            { id: 'task-8', name: 'Initial setup', description: 'Project structure and dependencies.', tags: [{ name: 'INIT', color: '#7b1fa2' }] },
        ],
    },
];

// Helper for migration type guard
function isTaskWithTags(task: unknown): task is Task {
    return typeof task === 'object' && task !== null && 'name' in task && 'description' in task;
}

export const useKanbanData = () => {
    const [cleared, setCleared] = useState(false);

    // Initialize columns from localStorage or defaults
    const getInitialColumns = (): Column[] => {
        const saved = localStorage.getItem(STORAGE_KEY);
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
                                            ? { name: t.slice(0, 5), color: '#455a64' }
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

    // Save to localStorage on columns change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
    }, [columns]);

    // Restore default tasks if all columns are empty
    useEffect(() => {
        if (!cleared && columns.every(col => col.tasks.length === 0)) {
            setColumns(DEFAULT_COLUMNS);
        }
    }, [columns, cleared]);

    const handleDragEnd = (result: DropResult) => {
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

    const addTask = (columnId: string, name: string, description: string, tags: Tag[]) => {
        if (!name.trim()) return;
        
        setColumns(cols =>
            cols.map(col =>
                col.id === columnId
                    ? {
                        ...col,
                        tasks: [
                            ...col.tasks,
                            { 
                                id: `task-${Date.now()}`, 
                                name: name.trim(), 
                                description: description.trim(), 
                                tags 
                            },
                        ],
                    }
                    : col
            )
        );
    };

    const updateTask = (columnId: string, taskId: string, name: string, description: string, tags: Tag[]) => {
        setColumns(cols =>
            cols.map(col =>
                col.id === columnId
                    ? {
                        ...col,
                        tasks: col.tasks.map(t =>
                            t.id === taskId
                                ? { ...t, name: name.trim(), description: description.trim(), tags }
                                : t
                        ),
                    }
                    : col
            )
        );
    };

    const deleteTask = (columnId: string, taskId: string) => {
        setColumns(cols =>
            cols.map(col =>
                col.id === columnId
                    ? { ...col, tasks: col.tasks.filter(t => t.id !== taskId) }
                    : col
            )
        );
    };

    const clearAllTasks = () => {
        setColumns(cols => cols.map(col => ({ ...col, tasks: [] })));
        setCleared(true);
    };

    return {
        columns,
        handleDragEnd,
        addTask,
        updateTask,
        deleteTask,
        clearAllTasks,
    };
};
