import { createContext, useContext, type PropsWithChildren } from 'react';

import { useTaskManager, type TaskContextType } from '../hooks/useTaskManager';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useTaskContext = () => {
	const context = useContext(TaskContext);
	if (context === undefined) {
		throw new Error('useTaskContext must be used within a TaskProvider');
	}
	return context;
};

export const TaskProvider = ({ children }: PropsWithChildren) => {
	const taskManager = useTaskManager();

	return (
		<TaskContext.Provider value={taskManager}>{children}</TaskContext.Provider>
	);
};
