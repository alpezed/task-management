import { render, screen } from '@testing-library/react';
import { it, expect, describe, vi, type Mock } from 'vitest';
import userEvent from '@testing-library/user-event';

import { useTaskContext } from '../../context/TaskContext';
import { TaskList } from './TaskList';

vi.mock(import('../../context/TaskContext'), () => ({
	useTaskContext: vi.fn(),
}));

const mockResponse = [
	{
		id: 1,
		title: 'Task 1',
		description: '',
		status: 'active',
		priority: 'low',
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];

describe('TaskListItem', () => {
	it('should render atleast 1 task', () => {
		(useTaskContext as Mock).mockReturnValue({
			filteredTasks: mockResponse,
			loading: false,
			error: null,
		});
		render(<TaskList />);
		expect(screen.getAllByRole('listitem')).toHaveLength(1);

		const editButton = screen.getByRole('button', { name: 'Edit task' });
		expect(editButton).toBeInTheDocument();
	});

	it('should edit and display the form', async () => {
		const user = userEvent.setup();

		(useTaskContext as Mock).mockReturnValue({
			filteredTasks: mockResponse,
			loading: false,
			error: null,
		});
		render(<TaskList />);
		expect(screen.getAllByRole('listitem')).toHaveLength(1);

		const editButton = screen.getByRole('button', { name: 'Edit task' });
		expect(editButton).toBeInTheDocument();

		await user.click(editButton);

		expect(
			screen.getByRole('textbox', { name: 'Edit task title' })
		).toBeInTheDocument();
	});

	it('should update and reflect the task detail changes', async () => {
		const mockUpdateTask = vi.fn(() => new Promise(res => res));
		const user = userEvent.setup();

		(useTaskContext as Mock).mockReturnValue({
			filteredTasks: mockResponse,
			loading: false,
			error: null,
			updateTask: mockUpdateTask,
		});
		render(<TaskList />);

		const editButton = screen.getByRole('button', { name: 'Edit task' });
		await user.click(editButton);

		const titleField = screen.getByRole('textbox', { name: 'Edit task title' });
		await user.clear(titleField);
		await user.type(titleField, 'Updated Task Title');

		const prioritySelect = screen.getByLabelText('Edit task priority');
		await user.selectOptions(prioritySelect, 'low');
		expect((prioritySelect as HTMLSelectElement).value).toBe('low');

		const saveButton = screen.getByRole('button', { name: 'Save changes' });
		expect(saveButton).toBeInTheDocument();

		await user.click(saveButton);

		expect(saveButton).toBeDisabled();

		expect(mockUpdateTask).toHaveBeenCalledWith(1, {
			title: 'Updated Task Title',
			description: '',
			priority: 'low',
		});

		expect(screen.getByDisplayValue('Updated Task Title')).toBeInTheDocument();
	});

	it('should not allow saving if the title is empty', async () => {
		const user = userEvent.setup();

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

		const editButton = screen.getByRole('button', { name: 'Edit task' });
		await user.click(editButton);

		const titleField = screen.getByRole('textbox', { name: 'Edit task title' });
		await user.clear(titleField);

		const saveButton = screen.getByRole('button', { name: 'Save changes' });
		expect(saveButton).toBeDisabled();
	});
});
