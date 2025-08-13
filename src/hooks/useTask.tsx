import { useCallback, useState } from 'react';

import type { Task } from '../types/task';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';

export function useTask(task: Task) {
	const { updateTask, deleteTask, toggleTaskStatus } = useTaskContext();

	const [isEditing, setIsEditing] = useState(false);
	const [isSubmitting, setSubmitting] = useState(false);
	const [editTitle, setEditTitle] = useState(task.title);
	const [editDescription, setEditDescription] = useState(task.description);
	const [editPriority, setEditPriority] = useState(task.priority);
	const [error, setError] = useState('');

	const handleToggleStatus = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			toggleTaskStatus(task.id);
		},
		[task, toggleTaskStatus]
	);

	const handleDelete = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			if (window.confirm('Are you sure you want to delete this task?')) {
				deleteTask(task.id);
			}
		},
		[task.id, deleteTask]
	);

	const handleEdit = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		setIsEditing(true);
	}, []);

	const handleSave = useCallback(async () => {
		setSubmitting(true);
		if (editTitle.trim()) {
			try {
				await updateTask(task.id, {
					title: editTitle,
					description: editDescription,
					priority: editPriority,
				});
				setSubmitting(false);
				setIsEditing(false);
			} catch (error: unknown) {
				if (error instanceof Error) {
					setError(error.message);
				} else {
					setError(String(error));
				}
				setSubmitting(false);
			}
		}
	}, [task.id, editTitle, editDescription, editPriority, updateTask]);

	const handleCancel = useCallback(() => {
		setEditTitle(task.title);
		setEditDescription(task.description);
		setEditPriority(task.priority);
		setIsEditing(false);
		setSubmitting(false);
	}, [task.title, task.description, task.priority]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
				handleSave();
			} else if (e.key === 'Escape') {
				handleCancel();
			}
		},
		[handleSave, handleCancel]
	);

	const getPriorityColor = (priority: Task['priority']) => {
		switch (priority) {
			case 'high':
				return 'bg-red-100 text-red-800 border-red-200';
			case 'medium':
				return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			case 'low':
				return 'bg-green-100 text-green-800 border-green-200';
		}
	};

	const getPriorityIcon = (priority: Task['priority']) => {
		switch (priority) {
			case 'high':
				return <AlertCircle className='w-4 h-4' />;
			case 'medium':
				return <Clock className='w-4 h-4' />;
			case 'low':
				return <CheckCircle className='w-4 h-4' />;
		}
	};

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	};

	return {
		task,
		error,
		editTitle,
		editDescription,
		editPriority,
		isEditing,
		isSubmitting,
		handleToggleStatus,
		handleDelete,
		handleEdit,
		handleKeyDown,
		handleCancel,
		handleSave,
		getPriorityColor,
		getPriorityIcon,
		formatDate,
		setEditTitle,
		setEditDescription,
		setEditPriority,
	};
}

export type TaskItemProps = ReturnType<typeof useTask>;
