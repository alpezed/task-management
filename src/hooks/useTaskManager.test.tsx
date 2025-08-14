import { renderHook, waitFor, act } from '@testing-library/react';
import { it, expect, describe, vi, beforeEach, afterEach } from 'vitest';
import { useTaskManager } from './useTaskManager';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as api from '../services/api';
import type { JSONPlaceholderTodo } from '../types/task';

vi.mock('notistack', () => ({
	enqueueSnackbar: vi.fn(),
}));

describe('useTaskManager', () => {
	const mockTasks: JSONPlaceholderTodo[] = [
		{ id: 1, userId: 1, title: 'Task 1', completed: false },
		{ id: 2, userId: 1, title: 'Task 2', completed: true },
		{ id: 3, userId: 1, title: 'Task 3', completed: false },
	];

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});

	const wrapper = ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);

	beforeEach(() => {
		queryClient.clear();
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should fetch tasks successfully', async () => {
		vi.spyOn(api, 'fetchTasks').mockResolvedValue(mockTasks);

		const { result } = renderHook(() => useTaskManager(), { wrapper });

		expect(result.current.loading).toBe(true);
		expect(result.current.error).toBeUndefined();

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
			expect(result.current.tasks).toHaveLength(3);
			expect(result.current.tasks?.[0].id).toBe('1');
			expect(result.current.tasks?.[0].title).toBe('Task 1');
			expect(result.current.tasks?.[0].status).toBe('active');
		});
	});

	it('should add a new task', async () => {
		vi.spyOn(api, 'fetchTasks').mockResolvedValue(mockTasks);
		vi.spyOn(api, 'createNewTask').mockResolvedValue({
			id: 4,
			userId: 1,
			title: 'New Task',
			completed: false,
		});

		const { result } = renderHook(() => useTaskManager(), { wrapper });

		await waitFor(() => expect(result.current.loading).toBe(false));

		// Store the initial length
		const initialLength = result.current.tasks?.length || 0;

		await act(async () => {
			await result.current.addTask({
				title: 'New Task',
				description: 'New task description',
				priority: 'medium',
			});
		});

		expect(api.createNewTask).toHaveBeenCalledWith({
			title: 'New Task',
			completed: false,
			userId: 1,
		});

		// Wait for the task to be added to the list
		await waitFor(() => {
			expect(result.current.tasks?.length).toBe(initialLength + 1);
		});

		// Check that the new task is at the beginning of the list
		const newTask = result.current.tasks?.[0];
		expect(newTask?.title).toBe('New Task');
		expect(newTask?.id).toBe('4');
	});

	it('should toggle task status', async () => {
		vi.spyOn(api, 'fetchTasks').mockResolvedValue(mockTasks);
		vi.spyOn(api, 'editTask').mockResolvedValue({
			id: 1,
			userId: 1,
			title: 'Task 1',
			completed: true,
		});

		const { result } = renderHook(() => useTaskManager(), { wrapper });

		await waitFor(() => expect(result.current.loading).toBe(false));

		// Verify initial state is 'active'
		expect(result.current.tasks?.find(t => t.id === '1')?.status).toBe(
			'active'
		);

		await act(() => {
			result.current.toggleTaskStatus('1');
		});

		// After toggling, the status should be updated in the local state
		await waitFor(() => {
			const updatedTask = result.current.tasks?.find(t => t.id === '1');
			expect(updatedTask?.status).toBe('completed');
		});

		expect(api.editTask).toHaveBeenCalledWith('1', {
			title: 'Task 1',
			completed: true,
		});
	});

	it('should update a task', async () => {
		vi.spyOn(api, 'fetchTasks').mockResolvedValue(mockTasks);
		vi.spyOn(api, 'editTask').mockResolvedValue({
			id: 1,
			userId: 1,
			title: 'Updated Task',
			completed: false,
		});

		const { result } = renderHook(() => useTaskManager(), { wrapper });

		await waitFor(() => expect(result.current.loading).toBe(false));

		await act(async () => {
			await result.current.updateTask('1', {
				title: 'Updated Task',
				description: 'Updated description',
				priority: 'high',
			});
		});

		expect(api.editTask).toHaveBeenCalledWith('1', {
			title: 'Updated Task',
		});

		// Wait for the task to be updated in the list
		await waitFor(() => {
			const updatedTask = result.current.tasks?.find(t => t.id === '1');
			expect(updatedTask?.title).toBe('Updated Task');
		});

		const updatedTask = result.current.tasks?.find(t => t.id === '1');
		expect(updatedTask?.description).toBe('Updated description');
		expect(updatedTask?.priority).toBe('high');
	});

	it('should filter tasks correctly', async () => {
		vi.spyOn(api, 'fetchTasks').mockResolvedValue(mockTasks);

		const { result } = renderHook(() => useTaskManager(), { wrapper });

		await waitFor(() => expect(result.current.loading).toBe(false));

		// Test 'all' filter (default)
		expect(result.current.filteredTasks).toHaveLength(3);

		// Test 'active' filter
		act(() => {
			result.current.setFilter('active');
		});
		expect(result.current.filteredTasks).toHaveLength(2);
		expect(result.current.filteredTasks.every(t => t.status === 'active')).toBe(
			true
		);

		// Test 'completed' filter
		act(() => {
			result.current.setFilter('completed');
		});
		expect(result.current.filteredTasks).toHaveLength(1);
		expect(
			result.current.filteredTasks.every(t => t.status === 'completed')
		).toBe(true);
	});

	it('should search tasks correctly', async () => {
		vi.spyOn(api, 'fetchTasks').mockResolvedValue(mockTasks);

		const { result } = renderHook(() => useTaskManager(), { wrapper });

		await waitFor(() => expect(result.current.loading).toBe(false));

		act(() => {
			result.current.setSearchTerm('Task 1');
		});

		expect(result.current.filteredTasks).toHaveLength(1);
		expect(result.current.filteredTasks[0].title).toBe('Task 1');

		// Clear search
		act(() => {
			result.current.setSearchTerm('');
		});

		expect(result.current.filteredTasks).toHaveLength(3);
	});

	it('should calculate task counts correctly', async () => {
		vi.spyOn(api, 'fetchTasks').mockResolvedValue(mockTasks);

		const { result } = renderHook(() => useTaskManager(), { wrapper });

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.taskCounts).toEqual({
			total: 3,
			active: 2,
			completed: 1,
		});
	});
});
