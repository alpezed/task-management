import { Plus } from 'lucide-react';

export function AddNewTaskButton({ openForm }: { openForm: () => void }) {
	return (
		<button
			onClick={openForm}
			className='w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer'
			aria-label='Add new task'
		>
			<Plus className='w-5 h-5' />
			<span className='font-medium'>Add New Task</span>
		</button>
	);
}
