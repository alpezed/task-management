import type { PropsWithChildren } from 'react';
import { TaskCardActions } from './TaskCardActions';
import { TaskCardBody } from './TaskCardBody';
import { TaskCardHeader } from './TaskCardHeader';

export const TaskCard = ({ children }: PropsWithChildren) => {
	return <div>{children}</div>;
};

TaskCard.Header = TaskCardHeader;
TaskCard.Body = TaskCardBody;
TaskCard.Actions = TaskCardActions;

export default TaskCard;
