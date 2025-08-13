import { useTaskContext } from '../../context/TaskContext';
import { TaskItemProvider } from '../../context/TaskItemContext';
import { TaskItem } from '../TaskItem/TaskItem';
import { TaskListError } from './TaskListError';
import { TaskListLoader } from './TaskListLoader';

export function TaskList() {
	const { filteredTasks, loading, error } = useTaskContext();

	if (loading) {
		return <TaskListLoader />;
	}

	if (error) {
		return <TaskListError>{error}</TaskListError>;
	}

	return (
		<div className='space-y-4' role='list' aria-label='Task list'>
			{filteredTasks?.map(task => (
				<div key={task.id} role='listitem'>
					<TaskItemProvider task={task}>
						<TaskItem />
					</TaskItemProvider>
				</div>
			))}
		</div>
	);
}
