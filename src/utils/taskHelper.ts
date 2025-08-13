import type { JSONPlaceholderTodo, Task, TaskStatus } from '../types/task';

export const generateId = (): string => {
	return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const transformJSONPlaceholderTodo = (
	todo: JSONPlaceholderTodo & Pick<Partial<Task>, 'description' | 'priority'>
): Task => {
	const now = new Date();
	const priorities: Task['priority'][] = ['low', 'medium', 'high'];
	const randomPriority =
		priorities[Math.floor(Math.random() * priorities.length)];

	return {
		id: todo.id.toString(),
		title: todo.title,
		description:
			todo.description ??
			`Task imported from JSONPlaceholder (User ${todo.userId})`,
		status: todo.completed ? 'completed' : 'active',
		priority: todo.priority ?? randomPriority,
		createdAt: new Date(
			now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000
		), // Random date within last week
		updatedAt: now,
	};
};

export const formatParams = (filters: Record<string, unknown>) => {
	const formatParams = Object.fromEntries(
		Object.entries(filters)
			.filter(
				([, value]) => value !== undefined && value !== '' && value !== null
			)
			.map(([key, value]) => [key, String(value)])
	);

	const params = new URLSearchParams({
		_limit: '10',
		...formatParams,
	});

	return params;
};

export const createTask = (
	title: string,
	description: string,
	priority: Task['priority']
): Task => {
	const now = new Date();
	return {
		id: generateId(),
		title: title.trim(),
		description: description.trim(),
		status: 'active' as TaskStatus,
		priority,
		createdAt: now,
		updatedAt: now,
	};
};

export const calculateTaskCounts = (tasks: Task[]) => {
	const total = tasks.length;
	const active = tasks.filter(task => task.status === 'active').length;
	const completed = tasks.filter(task => task.status === 'completed').length;

	return { total, active, completed };
};
