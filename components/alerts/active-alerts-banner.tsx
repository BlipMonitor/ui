'use client';

import * as React from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface ActiveAlertsBannerProps {
	count: number;
}

export function ActiveAlertsBanner({ count }: ActiveAlertsBannerProps) {
	if (count === 0) return null;

	return (
		<Link
			href='/dashboard/alerts'
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
					Active Alerts
					<span className='inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive-foreground/20 px-1.5 text-xs font-medium'>
						{count}
					</span>
				</AlertTitle>
				<AlertDescription className='text-destructive-foreground/90'>
					{count === 1
						? 'There is 1 active alert that requires your attention'
						: `There are ${count} active alerts that require your attention`}
				</AlertDescription>
			</Alert>
		</Link>
	);
}
