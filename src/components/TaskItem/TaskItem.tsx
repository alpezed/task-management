import TaskCard from '../TaskCard/TaskCard';

export function TaskItem() {
	return (
		<TaskCard>
			<TaskCard.Header />
			<TaskCard.Body />
			<TaskCard.Actions />
		</TaskCard>
	);
}
