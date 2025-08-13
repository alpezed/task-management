import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	createNewTask,
	deleteTask,
	editTask,
	fetchTasks,
} from '../services/api';
import { useCallback, useMemo, useState } from 'react';
import type { FilterType, JSONPlaceholderTodo, Task } from '../types/task';
import {
	calculateTaskCounts,
	createTask,
	filterTasks,
	transformJSONPlaceholderTodo,
} from '../utils/taskHelper';

export function useTaskManager() {
	const queryClient = useQueryClient();
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [filter, setFilter] = useState<FilterType>('all');

	const {
		data: tasks,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ['tasks'],
		queryFn: () => fetchTasks(),
		select: data => data.map(transformJSONPlaceholderTodo),
		retry: 1,
	});

	const { mutateAsync: createTodo, isPending: isAddingTask } = useMutation({
		mutationFn: (data: Partial<JSONPlaceholderTodo>) => createNewTask(data),
		onError: err => {
			console.warn('Failed to sync new task with API:', err);
		},
	});

	const { mutateAsync: deleteTodo } = useMutation({
		mutationFn: deleteTask,
		onError: err => {
			console.warn('Error deleting todo:', err);
		},
	});

	const { mutateAsync: updateTodo } = useMutation({
		mutationFn: (data: {
			id: string;
			payload: Pick<Task, 'title' | 'description' | 'priority'>;
		}) => editTask(data.id, data.payload),
		onError: err => {
			console.warn('Error updating todo:', err);
		},
	});

	const addTask = useCallback(
		async (taskData: {
			title: string;
			description: string;
			priority: Task['priority'];
		}) => {
			await createTodo(
				{ title: taskData.title, completed: false, userId: 1 },
				{
					onSuccess: data => {
						const newTask = createTask(
							taskData.title,
							taskData.description,
							taskData.priority
						);

						queryClient.setQueryData(
							['tasks'],
							(old: JSONPlaceholderTodo[]) => [
								{ ...newTask, id: data.id, userId: 1 },
								...old,
							]
						);
					},
				}
			);
		},
		[queryClient, createTodo]
	);

	const onDeleteTask = useCallback(
		async (todoId: string) => {
			await deleteTodo(todoId);
			queryClient.setQueryData(['tasks'], (tasks: JSONPlaceholderTodo[]) =>
				tasks.filter(task => task.id.toString() !== todoId)
			);
		},
		[deleteTodo, queryClient]
	);

	const updateTask = useCallback(
		async (
			taskId: string,
			payload: Pick<Task, 'title' | 'description' | 'priority'>
		) => {
			await updateTodo({ id: taskId, payload });

			queryClient.setQueryData(['tasks'], (old: JSONPlaceholderTodo[]) =>
				old.map(task => ({
					...task,
					...(task.id.toString() === taskId ? { ...payload } : task),
				}))
			);
		},
		[queryClient, updateTodo]
	);

	const filteredTasks = useMemo(
		() => filterTasks(tasks ?? [], filter, searchTerm),
		[tasks, filter, searchTerm]
	);

	const taskCounts = useMemo(() => calculateTaskCounts(tasks ?? []), [tasks]);

	return {
		tasks,
		loading: isLoading,
		adding: isAddingTask,
		error: error?.message,
		refreshTasks: refetch,
		filter,
		filteredTasks,
		searchTerm,
		setSearchTerm,
		setFilter,
		addTask,
		deleteTask: onDeleteTask,
		updateTask,
		taskCounts,
	};
}

export type TaskContextType = ReturnType<typeof useTaskManager>;
