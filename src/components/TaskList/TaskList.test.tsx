import { it, expect, describe, vi, type Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useTaskContext } from '../../context/TaskContext';
import { TaskList } from './TaskList';

vi.mock(import('../../context/TaskContext'), () => ({
	useTaskContext: vi.fn(),
}));

describe('TaskList', () => {
	it('should render loader when fetching the data', () => {
		(useTaskContext as Mock).mockReturnValue({
			loading: true,
			error: null,
			filteredTasks: [],
		});
		render(<TaskList />);
		expect(screen.getByText(/loading/i)).toBeInTheDocument();
		expect(screen.queryByRole('list')).not.toBeInTheDocument();
	});

	it('should render empty state when there are no tasks', () => {
		(useTaskContext as Mock).mockReturnValue({
			filteredTasks: [],
			loading: false,
			error: null,
		});
		render(<TaskList />);
		expect(
			screen.getByRole('heading', { name: /no tasks yet/i })
		).toBeInTheDocument();
	});

	it('should not render list when empty', () => {
		(useTaskContext as Mock).mockReturnValue({
			filteredTasks: [],
			loading: false,
			error: null,
		});
		render(<TaskList />);
		expect(screen.queryByRole('list')).not.toBeInTheDocument();
	});

	it('should not render list when error', () => {
		(useTaskContext as Mock).mockReturnValue({
			filteredTasks: [],
			loading: false,
			error: 'Error!',
		});
		render(<TaskList />);
		expect(screen.queryByRole('list')).not.toBeInTheDocument();
		expect(screen.getByText(/error!/i)).toBeInTheDocument();
	});

	it('should render a list of tasks', () => {
		(useTaskContext as Mock).mockReturnValue({
			filteredTasks: [
				{
					id: 1,
					title: 'Task 1',
					description: '',
					status: 'active',
					priority: 'low',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			loading: false,
			error: null,
		});
		render(<TaskList />);
		expect(screen.queryByRole('list')).toBeInTheDocument();
		expect(screen.getAllByRole('listitem')).toHaveLength(1);
		expect(screen.getByText('Task 1')).toBeInTheDocument();
	});
});
