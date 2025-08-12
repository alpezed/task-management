import { TaskList } from './components/TaskList/TaskList';
import Header from './components/Header/Header';
import Controls from './components/Controls/Controls';

function App() {
	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
			<div className='container mx-auto px-4 py-8 max-w-3xl'>
				<Header />
				<Controls />
				<TaskList />
			</div>
		</div>
	);
}

export default App;
