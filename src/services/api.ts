import type { JSONPlaceholderTodo, Task } from '../types/task';

export async function fetchTasks() {
	const result = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/todos?_limit=10`
	);

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

export async function deleteTask(taskId: string) {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/todos/${taskId}`,
		{
			method: 'DELETE',
		}
	);

	if (!response.ok) {
		throw new Error(`Failed to delete todo`);
	}
}

export async function editTask(
	taskId: string,
	input: Pick<Task, 'title' | 'description' | 'priority'>
) {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/todos/${taskId}`,
		{
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ ...input, userId: 1 }),
		}
	);

	if (!response.ok) {
		throw new Error(`Failed to update todo`);
	}

	const result = (await response.json()) as JSONPlaceholderTodo;

	return result;
}
