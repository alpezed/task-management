import { useQuery } from '@tanstack/react-query';
import { fetchTasks } from '../services/api';

export function useTaskManager() {
	const {
		data: tasks,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ['tasks'],
		queryFn: fetchTasks,
		retry: 1,
	});

	return {
		tasks,
		loading: isLoading,
		error: error?.message,
		refreshTasks: refetch,
	};
}

export type TaskContextType = ReturnType<typeof useTaskManager>;
