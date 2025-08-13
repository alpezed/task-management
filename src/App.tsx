import { TaskList } from './components/TaskList/TaskList';
import Header from './components/Header/Header';
import Controls from './components/Controls/Controls';
import TaskForm from './components/TaskForm/TaskForm';
import { TaskProvider } from './context/TaskContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './utils/reactQuery';

function AppContent() {
	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
			<div className='container mx-auto px-4 py-8 max-w-3xl'>
				<Header />
				<Controls />
				<TaskForm />
				<TaskList />
			</div>
		</div>
	);
}

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<TaskProvider>
				<AppContent />
			</TaskProvider>
		</QueryClientProvider>
	);
}

export default App;
