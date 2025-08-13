import { Loader2 } from 'lucide-react';

export function TaskListLoader() {
	return (
		<div className='text-center py-12'>
			<div className='mx-auto w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-4'>
				<Loader2 className='w-12 h-12 text-indigo-600 animate-spin' />
			</div>
			<h3 className='text-lg font-medium text-gray-900 mb-2'>
				Loading tasks...
			</h3>
			<p className='text-gray-500'>Fetching tasks from the server</p>
		</div>
	);
}
