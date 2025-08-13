import { AlertCircle, RefreshCw } from 'lucide-react';
import type { PropsWithChildren } from 'react';

import { useTaskContext } from '../../context/TaskContext';

export function TaskListError({ children }: PropsWithChildren) {
	const { refreshTasks } = useTaskContext();

	return (
		<div className='text-center py-12'>
			<div className='mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4'>
				<AlertCircle className='w-12 h-12 text-red-600' />
			</div>
			<h3 className='text-lg font-medium text-gray-900 mb-2'>
				Something went wrong!
			</h3>
			<p className='text-gray-500 mb-4 max-w-sm mx-auto'>{children}</p>
			<button
				onClick={() => refreshTasks()}
				className='inline-flex cursor-pointer items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-150'
			>
				<RefreshCw className='w-4 h-4' />
				Try Again
			</button>
		</div>
	);
}
