'use client';

import * as React from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface ActiveAnomaliesBannerProps {
	anomalies: {
		critical: number;
		high: number;
	};
}

export function ActiveAnomaliesBanner({
	anomalies,
}: ActiveAnomaliesBannerProps) {
	const totalAnomalies = anomalies.critical + anomalies.high;

	if (totalAnomalies === 0) return null;

	const description = [
		anomalies.critical > 0 && `${anomalies.critical} critical`,
		anomalies.high > 0 && `${anomalies.high} high severity`,
	]
		.filter(Boolean)
		.join(' and ');

	return (
		<Link
			href='/dashboard/anomalies'
			className='block'
		>
			<Alert
				variant='destructive'
				className={cn(
					'bg-destructive text-destructive-foreground border-none',
					'group hover:bg-destructive/90 transition-colors'
				)}
			>
				<AlertTriangle className='h-4 w-4 text-destructive-foreground' />
				<AlertTitle className='flex items-center gap-2 text-destructive-foreground'>
					Active Anomalies
					<span className='inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive-foreground/20 px-1.5 text-xs font-medium'>
						{totalAnomalies}
					</span>
				</AlertTitle>
				<AlertDescription className='text-destructive-foreground/90'>
					{totalAnomalies === 1
						? `You have ${description} anomaly that requires attention`
						: `You have ${description} anomalies that require attention`}
				</AlertDescription>
			</Alert>
		</Link>
	);
}
