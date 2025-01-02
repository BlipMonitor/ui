'use client';

import { generateMockAlerts, type Alert } from '@/lib/mock/alerts';
import { useState, useEffect } from 'react';
import { AlertActivityChart } from '@/components/charts/alert-activity-chart';
import { RecentAlertsCard } from '@/components/alerts/recent-alerts-card';
import { AlertMetrics } from '@/components/alerts/alert-metrics';

export default function AlertsPage() {
	const [mockAlerts, setMockAlerts] = useState<Alert[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [timeRange, setTimeRange] = useState('7d');

	useEffect(() => {
		// Generate mock data only on client side
		setMockAlerts(generateMockAlerts(50));
		setIsLoading(false);
	}, []);

	// Mock rules data
	const rulesData = {
		total: 5,
		active: 4,
		disabled: 1,
	};

	// Get recent alerts for the list
	const recentAlerts = [...mockAlerts]
		.sort((a, b) => b.triggeredAt.getTime() - a.triggeredAt.getTime())
		.slice(0, 5);

	if (isLoading) {
		return (
			<div className='flex flex-1 flex-col gap-4 p-4'>
				<div className='flex items-center justify-between'>
					<h1 className='text-lg font-medium'>Alerts</h1>
				</div>
				<div className='grid gap-4 md:grid-cols-2'>
					<div className='h-[140px] animate-pulse rounded-lg bg-muted' />
					<div className='h-[140px] animate-pulse rounded-lg bg-muted' />
				</div>
				<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
					<div className='col-span-4 h-[300px] animate-pulse rounded-lg bg-muted' />
					<div className='col-span-3 h-[300px] animate-pulse rounded-lg bg-muted' />
				</div>
			</div>
		);
	}

	return (
		<div className='flex flex-1 flex-col gap-4 p-4'>
			<div className='flex items-center justify-between'>
				<h1 className='text-lg font-medium'>Alerts</h1>
			</div>

			<div className='space-y-4'>
				<AlertMetrics
					alerts={mockAlerts}
					rulesData={rulesData}
				/>
				<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
					<AlertActivityChart
						alerts={mockAlerts}
						timeRange={timeRange}
						onTimeRangeChange={setTimeRange}
					/>
					<RecentAlertsCard alerts={recentAlerts} />
				</div>
			</div>
		</div>
	);
}
