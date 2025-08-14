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

import { useTaskContext } from "../../context/TaskContext";
import { TaskListEmpty } from "./TaskListEmpty";
import { TaskListError } from "./TaskListError";
import { TaskListItem } from "./TaskListItem";
import { TaskListLoader } from "./TaskListLoader";
import { useEffect, useState } from "react";
import type { Task } from "../../types/task";
import { queryClient } from "../../utils/reactQuery";

export function TaskList() {
	const { filteredTasks, loading, error } = useTaskContext();
	const [allItems, setAllItems] = useState<Task[]>(filteredTasks);
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	useEffect(() => {
		if (filteredTasks) {
			setAllItems(filteredTasks);
		}
	}, [filteredTasks]);

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (active.id !== over?.id) {
			setAllItems(items => {
				const oldIndex = items.findIndex(item => item.id === active.id);
				const newIndex = items.findIndex(item => item.id === over?.id);
				const updatedItems = arrayMove(items, oldIndex, newIndex);
				queryClient.setQueryData(["tasks"], updatedItems);
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
