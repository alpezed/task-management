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
import { enqueueSnackbar } from 'notistack';

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
		onError: () => {
			enqueueSnackbar('Error creating task', {
				variant: 'error',
			});
		},
		onSuccess: () => {
			enqueueSnackbar('Task created successfully', {
				variant: 'success',
			});
		},
	});

	const { mutateAsync: deleteTodo } = useMutation({
		mutationFn: deleteTask,
		onError: () => {
			enqueueSnackbar('Error deleting task', {
				variant: 'error',
			});
		},
		onSuccess: () => {
			enqueueSnackbar('Task deleted successfully', {
				variant: 'success',
			});
		},
	});

	const { mutateAsync: updateTodo } = useMutation({
		mutationFn: (data: {
			id: string;
			payload: Pick<Partial<JSONPlaceholderTodo>, 'title' | 'completed'>;
		}) => editTask(data.id, data.payload),
		onError: () => {
			enqueueSnackbar('Error updating task', {
				variant: 'error',
			});
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

	const toggleTaskStatus = useCallback(
		(taskId: string) => {
			const task = tasks?.find(t => t.id === taskId);
			queryClient.setQueryData(['tasks'], (old: JSONPlaceholderTodo[]) =>
				old.map(task => ({
					...task,
					...(task.id.toString() === taskId
						? { ...task, completed: !task.completed }
						: task),
				}))
			);

			const payload = {
				title: task?.title,
				completed: task?.status === 'active',
			};

			updateTodo(
				{ id: taskId, payload },
				{
					onSuccess: () => {
						enqueueSnackbar(
							<p>
								Task <strong>"{task?.title}"</strong> mark as{' '}
								<strong>{task?.status}</strong>
							</p>,
							{
								variant: 'success',
							}
						);
					},
				}
			);
		},
		[tasks, queryClient, updateTodo]
	);

	const updateTask = useCallback(
		async (
			taskId: string,
			payload: Pick<Task, 'title' | 'description' | 'priority'>
		) => {
			await updateTodo(
				{ id: taskId, payload: { title: payload.title } },
				{
					onSuccess: () => {
						enqueueSnackbar(
							<p>
								Task <strong>"{payload.title}"</strong> updated successfully
							</p>,
							{
								variant: 'success',
							}
						);
					},
				}
			);

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
		toggleTaskStatus,
	};
}

export type TaskContextType = ReturnType<typeof useTaskManager>;
