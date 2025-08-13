import { useTaskItemContext } from '../../context/TaskItemContext';
import TaskCard from '../TaskCard/TaskCard';

export function TaskItem() {
	const { task } = useTaskItemContext();

	return (
		<TaskCard className={task.status === 'completed' ? 'opacity-75' : ''}>
			<TaskCard.Header />
			<TaskCard.Body />
			<TaskCard.Actions />
		</TaskCard>
	);
}
