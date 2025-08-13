import { useQuery } from "@tanstack/react-query";
import { fetchTasks } from "../services/api";

export function useTaskManager() {
	const { data: tasks, isLoading } = useQuery({
		queryKey: ["tasks"],
		queryFn: fetchTasks,
	});

	return {
		loading: isLoading,
		tasks,
	};
}

export type TaskContextType = ReturnType<typeof useTaskManager>;
