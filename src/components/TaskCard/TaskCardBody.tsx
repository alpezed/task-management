import { useTaskItemContext } from '../../context/TaskItemContext';

export const TaskCardBody = () => {
	const { task, formatDate } = useTaskItemContext();

	return (
		<div className='px-6 py-4'>
			<div className='text-xs text-gray-500 flex items-center justify-between'>
				<span>Created: {formatDate(task.createdAt)}</span>
				{task.updatedAt.getTime() !== task.createdAt.getTime() && (
					<span>Updated: {formatDate(task.updatedAt)}</span>
				)}
			</div>
		</div>
	);
};
