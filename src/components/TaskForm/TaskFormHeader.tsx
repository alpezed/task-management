import { X } from 'lucide-react';

export function TaskFormHeader({
	errors,
	closeForm,
}: {
	errors: string[];
	closeForm: () => void;
}) {
	return (
		<>
			<div className='flex items-center justify-between mb-4'>
				<h3 className='text-lg font-semibold text-gray-900'>Add New Task</h3>
				<button
					onClick={closeForm}
					className='p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-md transition-colors duration-150'
					aria-label='Close form'
				>
					<X className='w-5 h-5' />
				</button>
			</div>

			{errors.length > 0 && (
				<div
					className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg'
					role='alert'
				>
					<ul className='text-sm text-red-700 space-y-1'>
						{errors.map((error, index) => (
							<li key={index}>{error}</li>
						))}
					</ul>
				</div>
			)}
		</>
	);
}
