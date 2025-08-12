import SearchBar from '../SearchBar/SearchBar';
import TaskFilter from '../TaskFilter/TaskFilter';

export default function Controls() {
	return (
		<div className='mb-8 space-y-4'>
			<div className='flex flex-col lg:flex-row gap-4'>
				<div className='flex-1'>
					<SearchBar />
				</div>
				<div className='flex-shrink-0'>
					<TaskFilter />
				</div>
			</div>
		</div>
	);
}
