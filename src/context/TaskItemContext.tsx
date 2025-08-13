import { createContext, useContext, type PropsWithChildren } from 'react';
import { useTask, type TaskItemProps } from '../hooks/useTask';
import type { Task } from '../types/task';

const TaskItemContext = createContext<TaskItemProps | undefined>(undefined);

export function TaskItemProvider({
	task,
	children,
}: PropsWithChildren<{ task: Task }>) {
	const taskItem = useTask(task);

	return (
		<TaskItemContext.Provider value={taskItem}>
			{children}
		</TaskItemContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTaskItemContext() {
	const taskItemContext = useContext(TaskItemContext);
	if (taskItemContext === undefined) {
		throw new Error(
			'useTaskItemContext must be used within a TaskItemProvider'
		);
	}
	return taskItemContext;
}
