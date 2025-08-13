import React, { useState, useCallback } from 'react';
import type { TaskPriority } from '../../types/task';
import { AddNewTaskButton } from './AddNewTaskButton';
import { TaskFormHeader } from './TaskFormHeader';
import { useTaskContext } from '../../context/TaskContext';

const TaskForm = React.memo(() => {
	const { adding, addTask } = useTaskContext();

	const [isOpen, setIsOpen] = useState(false);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [priority, setPriority] = useState<TaskPriority>('medium');
	const [errors, setErrors] = useState<string[]>([]);

	const openForm = useCallback(() => {
		setIsOpen(true);
	}, []);

	const closeForm = useCallback(() => {
		setIsOpen(false);
		setTitle('');
		setDescription('');
		setPriority('medium');
		setErrors([]);
	}, []);

	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();

			await addTask({
				title: title.trim(),
				description: description.trim(),
				priority,
			});

			closeForm();
		},
		[title, description, priority, closeForm, addTask]
	);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Escape') {
				closeForm();
			} else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
				handleSubmit(e);
			}
		},
		[closeForm, handleSubmit]
	);

	if (!isOpen) {
		return (
			<div className='mb-8'>
				<AddNewTaskButton openForm={openForm} />
			</div>
		);
	}

	return (
		<div className='bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8'>
			<TaskFormHeader errors={errors} closeForm={closeForm} />

			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label
						htmlFor='task-title'
						className='block text-sm font-medium text-gray-700 mb-2'
					>
						Task Title *
					</label>
					<input
						id='task-title'
						type='text'
						value={title}
						onChange={e => {
							setTitle(e.target.value);
							setErrors([]);
						}}
						onKeyDown={handleKeyDown}
						placeholder='Enter task title...'
						className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200'
						maxLength={100}
						required
						aria-describedby='task-title-hint'
					/>
				</div>

				<div>
					<label
						htmlFor='task-description'
						className='block text-sm font-medium text-gray-700 mb-2'
					>
						Description
					</label>
					{/* Intentionally comment the maxLength prop to show the validation error */}
					<textarea
						id='task-description'
						value={description}
						onChange={e => {
							setDescription(e.target.value);
							setErrors([]);
						}}
						onKeyDown={handleKeyDown}
						placeholder='Enter task description...'
						rows={3}
						className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none'
						// maxLength={500}
						aria-describedby='task-description-hint'
					/>
					<p className='mt-1 text-xs text-gray-500'>
						{description.length}/500 characters
					</p>
				</div>

				<div>
					<label
						htmlFor='task-priority'
						className='block text-sm font-medium text-gray-700 mb-2'
					>
						Priority
					</label>
					<select
						id='task-priority'
						value={priority}
						onChange={e => setPriority(e.target.value as TaskPriority)}
						className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200'
					>
						<option value='low'>Low Priority</option>
						<option value='medium'>Medium Priority</option>
						<option value='high'>High Priority</option>
					</select>
				</div>

				<div className='flex items-center gap-3 pt-4 border-t border-gray-100'>
					<button
						type='button'
						onClick={closeForm}
						className='flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-150'
					>
						Cancel
					</button>
					<button
						type='submit'
						disabled={adding || !title.trim()}
						className='flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer'
					>
						Add Task
					</button>
				</div>
			</form>
		</div>
	);
});

TaskForm.displayName = 'TaskForm';

export default TaskForm;
