import { CheckCheck } from 'lucide-react';

export default function Header() {
	return (
		<header className='text-center mb-10'>
			<div className='flex items-center justify-center gap-3 mb-4'>
				<div className='p-3 bg-green-600 rounded-xl shadow-lg'>
					<CheckCheck className='w-8 h-8 text-white' />
				</div>
				<h1 className='text-4xl font-bold text-gray-900'>Task Management</h1>
			</div>
		</header>
	);
}
