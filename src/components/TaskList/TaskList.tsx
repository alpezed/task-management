import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useQueryClient } from "@tanstack/react-query";

import { useTaskContext } from "../../context/TaskContext";
import { TaskListEmpty } from "./TaskListEmpty";
import { TaskListError } from "./TaskListError";
import { TaskListItem } from "./TaskListItem";
import { TaskListLoader } from "./TaskListLoader";
import type { Task } from "../../types/task";
import { useEffect, useState } from "react";

export function TaskList() {
	const queryClient = useQueryClient();
	const { filteredTasks, loading, error } = useTaskContext();
	const [allItems, setAllItems] = useState<Task[]>(filteredTasks || []);
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	useEffect(() => {
		if (!filteredTasks.length) return;

		setAllItems(prev => {
			if (!prev.length) return filteredTasks;

			// Keep the old order, but update task objects from filteredTasks
			const updated = prev
				.map(oldTask => {
					const newTask = filteredTasks.find(t => t.id === oldTask.id);
					return newTask ?? oldTask; // keep old if missing (shouldn't happen unless deleted)
				})
				// Add any new tasks that weren’t in the previous list
				.concat(filteredTasks.filter(t => !prev.some(old => old.id === t.id)));

			return updated;
		});
	}, [filteredTasks, allItems.length]);

	async function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (active.id !== over?.id) {
			queryClient.setQueryData(["tasks"], (oldTasks: Task[]) => {
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
					items={allItems.map(task => String(task.id))}
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
