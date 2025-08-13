import { Edit2, Trash } from 'lucide-react';
import { useTaskItemContext } from '../../context/TaskItemContext';

export const TaskCardActions = ({ className }: { className?: string }) => {
	const {
		editTitle,
		isEditing,
		isSubmitting,
		handleDelete,
		handleEdit,
		handleCancel,
		handleSave,
	} = useTaskItemContext();

	return (
		<div
			className={`px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2 ${className}`}
		>
			{isEditing ? (
				<>
					<button
						onClick={handleCancel}
						className='px-3 cursor-pointer py-1.5 text-sm text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-md transition-colors duration-150'
						aria-label='Cancel editing'
					>
						Cancel
					</button>
					<button
						onClick={handleSave}
						disabled={isSubmitting || !editTitle.trim()}
						className='px-3 cursor-pointer py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150'
						aria-label='Save changes'
					>
						Save
					</button>
				</>
			) : (
				<>
					<button
						onClick={handleEdit}
						className='p-2 cursor-pointer text-gray-400 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md transition-colors duration-150'
						aria-label='Edit task'
					>
						<Edit2 className='w-4 h-4' />
					</button>
					<button
						onClick={handleDelete}
						className='p-2 cursor-pointer text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md transition-colors duration-150'
						aria-label='Delete task'
					>
						<Trash className='w-4 h-4' />
					</button>
				</>
			)}
		</div>
	);
};
