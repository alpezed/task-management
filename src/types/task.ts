export type TaskStatus = 'active' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';
export type FilterType = 'all' | 'active' | 'completed';

export interface Task {
	id: string;
	title: string;
	description: string;
	status: 'active' | 'completed';
	priority: 'low' | 'medium' | 'high';
	createdAt: Date;
	updatedAt: Date;
}

export interface JSONPlaceholderTodo {
	userId: number;
	id: number;
	title: string;
	completed: boolean;
}
