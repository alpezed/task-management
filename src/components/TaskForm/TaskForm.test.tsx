import { render, screen, waitFor } from "@testing-library/react";
import { it, expect, describe, vi, type Mock } from "vitest";
import userEvent from "@testing-library/user-event";

import { useTaskContext } from "../../context/TaskContext";
import TaskForm from "./TaskForm";

vi.mock(import("../../context/TaskContext"), () => ({
	useTaskContext: vi.fn(),
}));

describe("TaskForm", () => {
	it("should able to click the add new task", async () => {
		(useTaskContext as Mock).mockReturnValue({
			adding: false,
		});
		render(<TaskForm />);

		const editButton = screen.getByLabelText("Add new task");
		expect(editButton).toBeInTheDocument();
	});

	it("should not allow adding if the title is empty", async () => {
		render(<TaskForm />);

		const editButton = screen.getByLabelText("Add new task");
		expect(editButton).toBeInTheDocument();

		await userEvent.click(editButton);

		const titleInput = screen.getByPlaceholderText(/Enter task title/i);
		expect(titleInput).toBeInTheDocument();

		const submitButton = screen.getByText(/Add task/i);
		expect(submitButton).toBeDisabled();
	});

	it("should add a new task", async () => {
		const user = userEvent.setup();
		const mockAddTask = vi.fn(() => Promise.resolve());

		const mockUseTaskContext = vi.fn(() => ({
			addTask: mockAddTask,
		}));

		(useTaskContext as Mock).mockImplementation(mockUseTaskContext);

		render(<TaskForm />);

		const editButton = screen.getByLabelText("Add new task");
		expect(editButton).toBeInTheDocument();

		await user.click(editButton);

		const titleInput = screen.getByPlaceholderText(/Enter task title/i);
		expect(titleInput).toBeInTheDocument();

		user.clear(titleInput);
		await user.type(titleInput, "New Task");

		await user.type(
			screen.getByPlaceholderText(/Enter task description/i),
			"sample"
		);

		const prioritySelect = screen.getByLabelText(/priority/i);
		await user.selectOptions(prioritySelect, "low");
		expect((prioritySelect as HTMLSelectElement).value).toBe("low");

		const submitButton = screen.getByText(/Add task/i);
		expect(submitButton).not.toBeDisabled();

		await user.click(submitButton);

		expect(mockAddTask).toHaveBeenCalledWith({
			title: "New Task",
			description: "sample",
			priority: "low",
		});
		
		await waitFor(() => {
			expect(screen.queryByPlaceholderText(/Enter task title/i)).not.toBeInTheDocument();
			expect(screen.getByLabelText("Add new task")).toBeInTheDocument();
		});
	});
});
