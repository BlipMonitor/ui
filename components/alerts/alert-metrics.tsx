'use client';

import { useRouter } from 'next/navigation';
import { AlertTriangle, Bell } from 'lucide-react';
import { type Alert } from '@/lib/mock/alerts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AlertMetricsProps {
	alerts: Alert[];
	rulesData: {
		total: number;
		active: number;
		disabled: number;
	};
}

export function AlertMetrics({ alerts, rulesData }: AlertMetricsProps) {
	const router = useRouter();

	// Calculate statistics
	const activeAlerts = alerts.filter((alert) => alert.status === 'active');
	const criticalAlerts = activeAlerts.filter(
		(alert) => alert.severity === 'critical'
	);
	const lastHourAlerts = activeAlerts.filter(
		(alert) => new Date().getTime() - alert.triggeredAt.getTime() <= 3600000
	);

	return (
		<div className='grid gap-4 md:grid-cols-2'>
			<Card
				className='hover:bg-muted/50 transition-colors cursor-pointer'
				onClick={() => router.push('/dashboard/alerts/feed')}
			>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>
						Active Alerts
					</CardTitle>
					<AlertTriangle className='h-4 w-4 text-muted-foreground' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>
						{activeAlerts.length}
					</div>
					<div className='mt-1 flex items-center gap-2'>
						{criticalAlerts.length > 0 && (
							<span className='rounded-md bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-1.5 py-0.5 text-xs font-medium'>
								{criticalAlerts.length} Critical
							</span>
						)}
						<span className='text-xs text-muted-foreground'>
							+{lastHourAlerts.length} since last hour
						</span>
					</div>
					<div className='mt-4'>
						<Button
							variant='link'
							className='h-auto p-0 text-sm'
							onClick={(e) => {
								e.stopPropagation();
								router.push('/dashboard/alerts/feed');
							}}
						>
							View all alerts →
						</Button>
					</div>
				</CardContent>
			</Card>
			<Card
				className='hover:bg-muted/50 transition-colors cursor-pointer'
				onClick={() => router.push('/dashboard/alerts/rules')}
			>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>
						Alert Rules
					</CardTitle>
					<Bell className='h-4 w-4 text-muted-foreground' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>{rulesData.total}</div>
					<p className='text-xs text-muted-foreground'>
						{rulesData.active} active, {rulesData.disabled} disabled
					</p>
					<div className='mt-4'>
						<Button
							variant='link'
							className='h-auto p-0 text-sm'
							onClick={(e) => {
								e.stopPropagation();
								router.push('/dashboard/alerts/rules');
							}}
						>
							Manage rules →
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
