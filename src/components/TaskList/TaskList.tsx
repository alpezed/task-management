import { useTaskContext } from '../../context/TaskContext';
import { TaskListEmpty } from './TaskListEmpty';
import { TaskListError } from './TaskListError';
import { TaskListItem } from './TaskListItem';
import { TaskListLoader } from './TaskListLoader';

export function TaskList() {
	const { filteredTasks, loading, error } = useTaskContext();

	if (loading) {
		return <TaskListLoader />;
	}

	if (error) {
		return <TaskListError>{error}</TaskListError>;
	}

	if (filteredTasks.length === 0) {
		return <TaskListEmpty />;
	}

	return (
		<div className='space-y-4' role='list' aria-label='Task list'>
			{filteredTasks?.map(task => (
				<TaskListItem key={task.id} task={task} />
			))}
		</div>
	);
}
