import { useTaskContext } from '../../context/TaskContext';
import { TaskItem } from '../TaskItem/TaskItem';
import { TaskListError } from './TaskListError';
import { TaskListLoader } from './TaskListLoader';

export function TaskList() {
	const { tasks, loading, error } = useTaskContext();

	console.log({ tasks });

	if (loading) {
		return <TaskListLoader />;
	}

	if (error) {
		return <TaskListError>{error}</TaskListError>;
	}

	return (
		<div>
			<TaskItem />
		</div>
	);
}
