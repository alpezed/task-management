import { useTaskManager } from "../../hooks/useTaskManager";
import { TaskItem } from "../TaskItem/TaskItem";

export function TaskList() {
	const { tasks, loading } = useTaskManager();

	console.log({ tasks });

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<TaskItem />
		</div>
	);
}
