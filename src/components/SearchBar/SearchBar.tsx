import React, { useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';

const SearchBar = React.memo(() => {
	const { searchTerm, setSearchTerm } = useTaskContext();

	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setSearchTerm(e.target.value);
		},
		[setSearchTerm]
	);

	const clearSearch = useCallback(() => {
		setSearchTerm('');
	}, [setSearchTerm]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Escape') {
				clearSearch();
			}
		},
		[clearSearch]
	);

	return (
		<div className='relative'>
			<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
				<Search className='h-5 w-5 text-gray-400' aria-hidden='true' />
			</div>
			<input
				type='text'
				placeholder='Search tasks...'
				value={searchTerm}
				onChange={handleSearchChange}
				onKeyDown={handleKeyDown}
				className='block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200'
				aria-label='Search tasks'
			/>
			{searchTerm && (
				<button
					onClick={clearSearch}
					className='absolute cursor-pointer inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors duration-150'
					aria-label='Clear search'
				>
					<X className='h-5 w-5 text-gray-400' />
				</button>
			)}
		</div>
	);
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;
