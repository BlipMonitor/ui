'use client';

import { useEffect, useState } from 'react';
import { Alert, generateMockAlerts } from '@/lib/mock/alerts';
import { AlertsTable } from '@/components/alerts/alerts-table';
import { NoAlerts } from '@/components/alerts/no-alerts';
import { Skeleton } from '@/components/ui/skeleton';
import {
	Alert as AlertUI,
	AlertDescription,
	AlertTitle,
} from '@/components/ui/alert';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AlertsPage() {
	const [alerts, setAlerts] = useState<Alert[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Simulate API call delay
		const timer = setTimeout(() => {
			setAlerts(generateMockAlerts(8));
			setIsLoading(false);
		}, 1000);

		return () => clearTimeout(timer);
	}, []);

	if (isLoading) {
		return (
			<div className='flex flex-1 flex-col gap-4 p-4'>
				<div className='flex items-center justify-between'>
					<Skeleton className='h-6 w-32' />
					<div className='flex items-center gap-2'>
						<Skeleton className='h-9 w-[240px]' />
					</div>
				</div>

				<div className='space-y-2'>
					<Skeleton className='h-9 w-full' />
					<Skeleton className='h-12 w-full' />
					<Skeleton className='h-12 w-full' />
					<Skeleton className='h-12 w-full' />
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex flex-1 flex-col gap-4 p-4'>
				<div className='flex items-center justify-between'>
					<h1 className='text-lg font-medium'>Recent Alerts</h1>
				</div>
				<AlertUI variant='destructive'>
					<AlertCircle className='h-4 w-4' />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription className='flex items-center justify-between'>
						<span>{error}</span>
						<Button
							variant='outline'
							size='sm'
							onClick={() => {
								setIsLoading(true);
								setError(null);
								// Simulate retry
								setTimeout(() => setIsLoading(false), 1000);
							}}
						>
							<RefreshCcw className='mr-2 h-4 w-4' />
							Retry
						</Button>
					</AlertDescription>
				</AlertUI>
			</div>
		);
	}

	if (!isLoading && alerts.length === 0) {
		return (
			<div className='flex flex-1 flex-col gap-4 p-4'>
				<div className='flex items-center justify-between'>
					<h1 className='text-lg font-medium'>Recent Alerts</h1>
				</div>
				<NoAlerts />
			</div>
		);
	}

	return (
		<div className='flex flex-1 flex-col gap-4 p-4'>
			<div className='flex items-center justify-between'>
				<h1 className='text-lg font-medium'>Recent Alerts</h1>
			</div>
			<AlertsTable
				alerts={alerts}
				isLoading={isLoading}
			/>
		</div>
	);
}
