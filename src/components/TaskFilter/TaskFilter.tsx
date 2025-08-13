import React, { useCallback } from 'react';
import type { FilterType } from '../../types/task';
import { useTaskContext } from '../../context/TaskContext';

const TaskFilter = React.memo(() => {
	const { filter, setFilter, taskCounts } = useTaskContext();

	const handleFilterChange = useCallback(
		(newFilter: FilterType) => {
			setFilter(newFilter);
		},
		[setFilter]
	);

	const filterOptions = [
		{ key: 'all', label: 'All', count: taskCounts.total },
		{ key: 'active', label: 'Active', count: taskCounts.active },
		{ key: 'completed', label: 'Completed', count: taskCounts.completed },
	] as const;

	return (
		<div className='flex flex-wrap gap-2'>
			{filterOptions.map(({ key, label, count }) => (
				<button
					key={key}
					onClick={() => handleFilterChange(key)}
					className={`
            px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-2
            ${
							filter === key
								? 'bg-indigo-600 text-white shadow-lg transform scale-105'
								: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
						}
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
          `}
					aria-pressed={filter === key}
					aria-label={`Filter by ${label} tasks`}
				>
					<span>{label}</span>
					<span
						className={`
            px-2 py-0.5 rounded-full text-xs
            ${
							filter === key
								? 'bg-indigo-500 text-indigo-100'
								: 'bg-gray-100 text-gray-600'
						}
          `}
					>
						{count}
					</span>
				</button>
			))}
		</div>
	);
});

TaskFilter.displayName = 'TaskFilter';

export default TaskFilter;
