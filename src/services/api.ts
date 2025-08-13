import type { JSONPlaceholderTodo } from "../types/task";

export async function fetchTasks() {
	const result = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/todos/?_limit=10`
	);

	if (!result.ok) {
		const error = await result.json();
		throw new Error(error.message);
	}

	const response = (await result.json()) as JSONPlaceholderTodo[];

	return response;
}
