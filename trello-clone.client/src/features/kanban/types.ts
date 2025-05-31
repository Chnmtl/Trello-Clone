export interface Tag {
    name: string;
    color: string;
}

export interface Task {
    id: string;
    name: string;
    description: string;
    tags?: Tag[];
}

export interface Column {
    id: string;
    title: string;
    tasks: Task[];
}

export interface TaskFormData {
    name: string;
    description: string;
}

export type DeleteConfirmation = {
    columnId: string;
    taskId: string;
} | null;

export type EditingTask = {
    columnId: string;
    task: Task;
} | null;
