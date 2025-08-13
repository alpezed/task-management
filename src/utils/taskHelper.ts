import type { FilterType, JSONPlaceholderTodo, Task } from '../types/task';

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

export const filterTasks = (
	tasks: Task[],
	filter: FilterType,
	searchTerm: string
): Task[] => {
	let filtered = tasks;

	if (filter !== 'all') {
		filtered = filtered.filter(task => task.status === filter);
	}

	if (searchTerm.trim()) {
		const term = searchTerm.toLowerCase().trim();
		filtered = filtered.filter(
			task =>
				task.title.toLowerCase().includes(term) ||
				task.description.toLowerCase().includes(term)
		);
	}

	return filtered;
};
