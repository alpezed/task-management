import { it, expect, describe, vi, type Mock, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { TaskList } from "../components/TaskList/TaskList";
import { useTaskContext } from "../context/TaskContext";

vi.mock(import("../context/TaskContext"), () => ({
	useTaskContext: vi.fn(),
}));

describe("TaskList", () => {
	afterEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it("should render loader when fetching the data", () => {
		(useTaskContext as Mock).mockReturnValue({
			loading: true,
			error: null,
		});
		render(<TaskList />);
		expect(screen.getByText(/loading/i)).toBeTruthy();
		expect(screen.queryByRole("list")).not.toBeTruthy();
	});

	it("should render empty state when there are no tasks", () => {
		(useTaskContext as Mock).mockReturnValue({
			filteredTasks: [],
			loading: false,
			error: null,
		});
		render(<TaskList />);
		expect(screen.getByRole("heading", { name: /no tasks yet/i })).toBeTruthy();
	});

	it("should not render list when empty", () => {
		(useTaskContext as Mock).mockReturnValue({
			filteredTasks: [],
			loading: false,
			error: null,
		});
		render(<TaskList />);
		expect(screen.queryByRole("list")).not.toBeTruthy();
	});

	it("should not render list when error", () => {
		(useTaskContext as Mock).mockReturnValue({
			filteredTasks: [],
			loading: false,
			error: "Error!",
		});
		render(<TaskList />);
		expect(screen.queryByRole("list")).not.toBeTruthy();
		expect(screen.getByText(/error!/i)).toBeTruthy();
	});

	it("should render a list of tasks", () => {
		(useTaskContext as Mock).mockReturnValue({
			filteredTasks: [
				{
					id: 1,
					title: "Task 1",
					description: "",
					status: "active",
					priority: "low",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			loading: false,
			error: null,
		});
		render(<TaskList />);
		expect(screen.queryByRole("list")).toBeTruthy();
		expect(screen.getAllByRole("listitem")).toHaveLength(1);
		expect(screen.getByText("Task 1")).toBeTruthy();
	});
});
