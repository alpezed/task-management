import { Check } from 'lucide-react';

import { useTaskItemContext } from '../../context/TaskItemContext';
import type { Task } from '../../types/task';
import { cn } from '../../utils/cn';

export const TaskCardHeader = ({ className }: { className?: string }) => {
	const {
		task,
		error,
		editTitle,
		editDescription,
		editPriority,
		isEditing,
		handleToggleStatus,
		handleKeyDown,
		setEditTitle,
		getPriorityColor,
		getPriorityIcon,
		setEditDescription,
		setEditPriority,
	} = useTaskItemContext();

	const isCompleted = task.status === 'completed';

	return (
		<div className={cn('px-6 py-4 border-b border-gray-100', className)}>
			<div className='flex items-start justify-between gap-4'>
				<div className='flex items-start gap-3 flex-1'>
					<button
						onClick={handleToggleStatus}
						className={cn(
							`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`,
							{
								'bg-green-600 border-green-600 text-white': isCompleted,
								'border-gray-300 hover:border-green-500 hover:bg-green-50':
									!isCompleted,
							}
						)}
						aria-label={isCompleted ? 'Mark as active' : 'Mark as completed'}
					>
						{isCompleted && <Check className='w-3 h-3' />}
					</button>

					<div className='flex-1 min-w-0'>
						{isEditing ? (
							<>
								{error && (
									<div
										className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg'
										role='alert'
									>
										<div className='text-sm text-red-700 space-y-1'>
											{error}
										</div>
									</div>
								)}
								<div className='space-y-3'>
									<input
										type='text'
										value={editTitle}
										onChange={e => setEditTitle(e.target.value)}
										onKeyDown={handleKeyDown}
										className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
										placeholder='Task title'
										aria-label='Edit task title'
									/>
									<textarea
										value={editDescription}
										onChange={e => setEditDescription(e.target.value)}
										onKeyDown={handleKeyDown}
										className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none'
										rows={2}
										placeholder='Task description'
										aria-label='Edit task description'
									/>
									<select
										value={editPriority}
										onChange={e =>
											setEditPriority(e.target.value as Task['priority'])
										}
										className='px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
										aria-label='Edit task priority'
									>
										<option value='low'>Low Priority</option>
										<option value='medium'>Medium Priority</option>
										<option value='high'>High Priority</option>
									</select>
								</div>
							</>
						) : (
							<div className='space-y-2'>
								<h3
									className={cn('text-lg font-semibold text-gray-900', {
										'line-through text-gray-500': isCompleted,
									})}
								>
									{task.title}
								</h3>
								{task.description && (
									<p
										className={cn('text-sm leading-relaxed text-gray-600', {
											'text-gray-400': isCompleted,
										})}
									>
										{task.description}
									</p>
								)}
							</div>
						)}
					</div>
				</div>

				{!isEditing && (
					<div className='flex items-center gap-2'>
						<span
							className={cn(
								'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border',
								getPriorityColor(task.priority)
							)}
						>
							{getPriorityIcon(task.priority)}
							{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
						</span>
					</div>
				)}
			</div>
		</div>
	);
};
