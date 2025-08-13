import type { JSONPlaceholderTodo, Task } from '../types/task';

export const transformJSONPlaceholderTodo = (
	todo: JSONPlaceholderTodo
): Task => {
	const now = new Date();
	const priorities: Task['priority'][] = ['low', 'medium', 'high'];
	const randomPriority =
		priorities[Math.floor(Math.random() * priorities.length)];

	return {
		id: todo.id.toString(),
		title: todo.title,
		description: `Task imported from JSONPlaceholder (User ${todo.userId})`,
		status: todo.completed ? 'completed' : 'active',
		priority: randomPriority,
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
				([_, value]) => value !== undefined && value !== '' && value !== null
			)
			.map(([key, value]) => [key, String(value)])
	);

	const params = new URLSearchParams({
		_limit: '10',
		...formatParams,
	});

	return params;
};
