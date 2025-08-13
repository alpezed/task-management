import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createNewTask, fetchTasks } from '../services/api';
import { useCallback, useState } from 'react';
import type {
	FilterParams,
	FilterType,
	JSONPlaceholderTodo,
	Task,
} from '../types/task';
import { createTask, transformJSONPlaceholderTodo } from '../utils/taskHelper';

export function useTaskManager() {
	const queryClient = useQueryClient();
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [filter, setFilter] = useState<FilterType>('all');

	const filterParams: FilterParams = {
		title: searchTerm || undefined,
		completed:
			filter === 'completed' ? true : filter === 'active' ? false : undefined,
	};

	const {
		data: tasks,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ['tasks', { searchTerm, filter }],
		queryFn: () => fetchTasks(filterParams),
		select: data => data.map(transformJSONPlaceholderTodo),
		retry: 1,
	});

	const { mutateAsync: createTodo, isPending: isAddingTask } = useMutation({
		mutationFn: (data: Partial<JSONPlaceholderTodo>) => createNewTask(data),
		onError: err => {
			console.warn('Failed to sync new task with API:', err);
		},
	});

	const addTask = useCallback(
		async (taskData: {
			title: string;
			description: string;
			priority: Task['priority'];
		}) => {
			await createTodo({
				title: taskData.title,
				completed: false,
				userId: 1,
			});

			const newTask = createTask(
				taskData.title,
				taskData.description,
				taskData.priority
			);

			queryClient.setQueryData(
				['tasks', { searchTerm, filter }],
				(old: JSONPlaceholderTodo[]) => [{ ...newTask, userId: 1 }, ...old]
			);
		},
		[]
	);

	return {
		tasks,
		loading: isLoading,
		adding: isAddingTask,
		error: error?.message,
		refreshTasks: refetch,
		filter,
		searchTerm,
		setSearchTerm,
		setFilter,
		addTask,
	};
}

export type TaskContextType = ReturnType<typeof useTaskManager>;
