'use client';

import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { type Alert } from '@/lib/mock/alerts';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

interface RecentAlertsCardProps {
	alerts: Alert[];
	onAlertClick?: (alert: Alert) => void;
}

export function RecentAlertsCard({
	alerts,
	onAlertClick,
}: RecentAlertsCardProps) {
	const router = useRouter();

	const handleCardClick = (e: React.MouseEvent, alert?: Alert) => {
		if (alert && onAlertClick) {
			e.stopPropagation();
			onAlertClick(alert);
		} else {
			router.push('/dashboard/alerts/feed');
		}
	};

	return (
		<Card
			className='col-span-3 cursor-pointer transition-colors hover:bg-muted/50'
			onClick={(e) => handleCardClick(e)}
		>
			<CardHeader>
				<CardTitle>Recent Alerts</CardTitle>
				<CardDescription>
					Latest alerts across all rules
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{alerts.map((alert) => (
						<div
							key={alert.id}
							className='flex flex-col gap-1'
							onClick={(e) => handleCardClick(e, alert)}
						>
							<div className='flex items-center justify-between'>
								<span className='text-sm font-medium'>
									{alert.name}
								</span>
								<span
									className={cn(
										'rounded-md px-1.5 py-0.5 text-xs font-medium',
										{
											'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300':
												alert.severity === 'critical',
											'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300':
												alert.severity === 'high',
											'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300':
												alert.severity === 'medium',
											'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300':
												alert.severity === 'low',
										}
									)}
								>
									{alert.severity.charAt(0).toUpperCase() +
										alert.severity.slice(1)}
								</span>
							</div>
							<p className='text-xs text-muted-foreground line-clamp-1'>
								{alert.summary}
							</p>
							<p className='text-xs text-muted-foreground'>
								{formatDistanceToNow(alert.triggeredAt, {
									addSuffix: true,
								})}
							</p>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
