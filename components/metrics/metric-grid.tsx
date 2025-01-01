import { ReactNode } from 'react';

interface MetricGridProps {
	children: ReactNode;
}

export function MetricGrid({ children }: MetricGridProps) {
	return (
		<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
			{children}
		</div>
	);
}
