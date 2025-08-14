import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';

import { useTaskContext } from '../../context/TaskContext';
import { TaskListEmpty } from './TaskListEmpty';
import { TaskListError } from './TaskListError';
import { TaskListItem } from './TaskListItem';
import { TaskListLoader } from './TaskListLoader';
import type { Task } from '../../types/task';
import { queryClient } from '../../utils/reactQuery';

export function TaskList() {
	const { filteredTasks, loading, error } = useTaskContext();
	const [allItems, setAllItems] = useState<Task[]>(filteredTasks || []);
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	useEffect(() => {
		if (!filteredTasks.length) {
			setAllItems([]); // nothing left
			return;
		}

		setAllItems(prev => {
			// Remove tasks that no longer exist
			const existingIds = new Set(filteredTasks.map(t => t.id));
			const cleaned = prev.filter(t => existingIds.has(t.id));

			// Update existing tasks with new data
			const updated = cleaned.map(oldTask => {
				const newTask = filteredTasks.find(t => t.id === oldTask.id);
				return newTask ?? oldTask;
			});

			// Add new tasks that weren't in prev
			const newOnes = filteredTasks.filter(
				t => !prev.some(old => old.id === t.id)
			);

			return [...updated, ...newOnes];
		});
	}, [filteredTasks, allItems.length]);

	async function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (active.id !== over?.id) {
			queryClient.setQueryData(['tasks'], (oldTasks: Task[]) => {
				if (!oldTasks) return [];
				const oldIndex = oldTasks.findIndex(
					task => String(task.id) === active.id
				);
				const newIndex = oldTasks.findIndex(
					task => String(task.id) === over?.id
				);
				return arrayMove(oldTasks, oldIndex, newIndex);
			});

			setAllItems(items => {
				const oldIndex = items.findIndex(item => item.id === active.id);
				const newIndex = items.findIndex(item => item.id === over?.id);
				const updatedItems = arrayMove(items, oldIndex, newIndex);
				return updatedItems;
			});
		}
	}

	if (loading) {
		return <TaskListLoader />;
	}

	if (error) {
		return <TaskListError>{error}</TaskListError>;
	}

	if (filteredTasks.length === 0) {
		return <TaskListEmpty />;
	}

	return (
		<div className='space-y-4' role='list' aria-label='Task list'>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={allItems}
					strategy={verticalListSortingStrategy}
				>
					{allItems?.map(task => (
						<TaskListItem key={task.id} task={task} />
					))}
				</SortableContext>
			</DndContext>
		</div>
	);
}
