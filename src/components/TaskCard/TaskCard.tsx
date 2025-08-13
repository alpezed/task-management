import type { ReactNode } from 'react';
import { TaskCardBody } from './TaskCardBody';
import { TaskCardActions } from './TaskCardActions';
import { TaskCardHeader } from './TaskCardHeader';
import { cn } from '../../utils/cn';

interface TaskCardProps {
	children: ReactNode;
	className?: string;
	onClick?: () => void;
}

function TaskCard({ children, className, onClick }: TaskCardProps) {
	function handleKeydown(e: React.KeyboardEvent<HTMLDivElement>) {
		if (onClick) {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				onClick();
			}
		}
	}

	return (
		<div
			className={cn(
				`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden`,
				{
					'cursor-pointer': onClick,
				},
				className
			)}
			onClick={onClick}
			role={onClick ? 'button' : undefined}
			tabIndex={onClick ? 0 : undefined}
			onKeyDown={onClick ? handleKeydown : undefined}
		>
			{children}
		</div>
	);
}

TaskCard.Header = TaskCardHeader;
TaskCard.Body = TaskCardBody;
TaskCard.Actions = TaskCardActions;

export default TaskCard;
