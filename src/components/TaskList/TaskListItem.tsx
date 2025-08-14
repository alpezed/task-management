import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { TaskItemProvider } from "../../context/TaskItemContext";
import type { Task } from "../../types/task";
import { TaskItem } from "../TaskItem/TaskItem";

export function TaskListItem({ task }: { task: Task }) {
	const { attributes, setNodeRef, transform, transition } = useSortable({
		id: task.id,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<TaskItemProvider task={task}>
			<div role='listitem'>
				<div ref={setNodeRef} style={style} {...attributes}>
					<TaskItem />
				</div>
			</div>
		</TaskItemProvider>
	);
}
