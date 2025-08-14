import { TaskItemProvider } from '../../context/TaskItemContext';
import type { Task } from '../../types/task';
import { TaskItem } from '../TaskItem/TaskItem';

export function TaskListItem({ task }: { task: Task }) {
	return (
		<TaskItemProvider task={task}>
			<div role='listitem'>
				<TaskItem />
			</div>
		</TaskItemProvider>
	);
}
