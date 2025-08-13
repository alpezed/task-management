import { useQuery } from '@tanstack/react-query';
import { fetchTasks } from '../services/api';
import { useMemo, useState } from 'react';
import type { FilterType } from '../types/task';
import { filterTasks, transformJSONPlaceholderTodo } from '../utils/taskHelper';

export function useTaskManager() {
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [filter, setFilter] = useState<FilterType>('all');

	const {
		data: tasks,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ['tasks'],
		queryFn: fetchTasks,
		select: data => data.map(transformJSONPlaceholderTodo),
		retry: 1,
	});

	const filteredTasks = useMemo(() => {
		if (tasks) {
			filterTasks(tasks, filter, searchTerm);
		}
	}, [tasks, filter, searchTerm]);

	return {
		tasks,
		loading: isLoading,
		error: error?.message,
		refreshTasks: refetch,
		filteredTasks,
		setSearchTerm,
		setFilter,
	};
}

export type TaskContextType = ReturnType<typeof useTaskManager>;
