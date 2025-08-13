import { CheckCircle2 } from 'lucide-react';

import { useTaskContext } from '../../context/TaskContext';

export function TaskListEmpty() {
	const { searchTerm, filter } = useTaskContext();

	return (
		<div className='text-center py-12'>
			<div className='mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
				<CheckCircle2 className='w-12 h-12 text-gray-400' />
			</div>
			<h3 className='text-lg font-medium text-gray-900 mb-2'>
				{searchTerm
					? 'No matching tasks found'
					: filter === 'completed'
					? 'No completed tasks yet'
					: filter === 'active'
					? 'No active tasks'
					: 'No tasks yet'}
			</h3>
			<p className='text-gray-500 max-w-sm mx-auto'>
				{searchTerm
					? "Try adjusting your search terms or filters to find what you're looking for."
					: filter === 'completed'
					? 'Complete some tasks to see them here.'
					: filter === 'active'
					? 'All your tasks are completed! Add a new task to get started.'
					: 'Get started by adding your first task.'}
			</p>
		</div>
	);
}
