import { useMutation, useQuery } from '@tanstack/react-query';
import { createTask, fetchTasks } from '../services/api';
import { useState } from 'react';
import type { FilterType, JSONPlaceholderTodo } from '../types/task';
import { transformJSONPlaceholderTodo } from '../utils/taskHelper';

export function useTaskManager() {
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [filter, setFilter] = useState<FilterType>('all');

	const filterParams: Record<string, unknown> = {
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

	const { mutateAsync: addTask } = useMutation({
		mutationKey: ['add-task'],
		mutationFn: (data: Partial<JSONPlaceholderTodo>) => createTask(data),
	});

	console.log('--hook', tasks);

	return {
		tasks,
		loading: isLoading,
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
