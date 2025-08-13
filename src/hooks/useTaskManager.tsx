import { useQuery } from '@tanstack/react-query';
import { fetchTasks } from '../services/api';
import { useState } from 'react';
import type { FilterType } from '../types/task';
import {
	formatParams,
	transformJSONPlaceholderTodo,
} from '../utils/taskHelper';

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
		queryFn: () => fetchTasks(formatParams(filterParams)),
		select: data => data.map(transformJSONPlaceholderTodo),
		retry: 1,
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
	};
}

export type TaskContextType = ReturnType<typeof useTaskManager>;
