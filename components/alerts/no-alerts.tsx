import { AlertCircle } from 'lucide-react';

export function NoAlerts() {
	return (
		<div className='flex flex-col items-center justify-center p-8 text-center'>
			<AlertCircle className='h-12 w-12 text-muted-foreground mb-4' />
			<h3 className='text-lg font-semibold'>No Recent Alerts</h3>
			<p className='text-sm text-muted-foreground mt-2'>
				There are no resolved or acknowledged alerts from the past 7
				days.
			</p>
		</div>
	);
}
