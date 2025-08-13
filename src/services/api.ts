import type { FilterParams, JSONPlaceholderTodo } from '../types/task';

export async function fetchTasks(filters: FilterParams) {
	const url = new URL(`${import.meta.env.VITE_API_BASE_URL}/todos`);
	url.searchParams.append('_limit', '10');
	Object.entries(filters).forEach(([key, value]) => {
		if (typeof value !== 'undefined') {
			url.searchParams.append(key, value);
		}
	});

	const result = await fetch(url);

	if (!result.ok) {
		throw new Error(`Failed to fetch todos`);
	}

	const response = (await result.json()) as JSONPlaceholderTodo[];

	return response;
}

export async function createNewTask(input: Partial<JSONPlaceholderTodo>) {
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
