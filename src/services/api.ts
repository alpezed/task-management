import type { JSONPlaceholderTodo } from '../types/task';

export async function fetchTasks() {
	const result = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/todos/?_limit=10`
	);

	if (!result.ok) {
		throw new Error(`Failed to fetch todos`);
	}

	const response = (await result.json()) as JSONPlaceholderTodo[];

	return response;
}
