import type { JSONPlaceholderTodo } from '../types/task';

export async function fetchTasks(filters: Record<string, unknown>) {
	const url = new URL(`${import.meta.env.VITE_API_BASE_URL}/todos`);
	url.searchParams.append('limit', '10');
	url.searchParams.append('completed', 'false');

	const result = await fetch(url);

	if (!result.ok) {
		throw new Error(`Failed to fetch todos`);
	}

	const response = (await result.json()) as JSONPlaceholderTodo[];

	return response;
}

export async function createTask(input: Partial<JSONPlaceholderTodo>) {
	const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/todos`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ ...input, userId: 1 }),
	});

	if (!response.ok) {
		throw new Error(`Failed to create todo`);
	}

	return await response.json();
}
