import { useTaskContext } from '../../context/TaskContext';
import { TaskItemProvider } from '../../context/TaskItemContext';
import { TaskItem } from '../TaskItem/TaskItem';
import { TaskListError } from './TaskListError';
import { TaskListLoader } from './TaskListLoader';

export function TaskList() {
	const { tasks, loading, error } = useTaskContext();

	console.log('--TaskList', { tasks });

	if (loading) {
		return <TaskListLoader />;
	}

	if (error) {
		return <TaskListError>{error}</TaskListError>;
	}

	return (
		<div className='space-y-4' role='list' aria-label='Task list'>
			{tasks?.map(task => (
				<div key={task.id} role='listitem'>
					<TaskItemProvider task={task}>
						<TaskItem />
					</TaskItemProvider>
				</div>
			))}
		</div>
	);
}
