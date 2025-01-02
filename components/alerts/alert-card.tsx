import { AlertTriangle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AlertStatusBadge } from './alert-status-badge';

interface AlertCardProps {
	title: string;
	message: string;
	severity: 'critical' | 'warning' | 'info';
	timestamp: Date;
	contractName: string;
	ruleName: string;
}

export function AlertCard({
	title,
	message,
	severity,
	timestamp,
	contractName,
	ruleName,
}: AlertCardProps) {
	return (
		<Card>
			<CardHeader className='flex flex-row items-start gap-4 space-y-0 pb-2'>
				<AlertTriangle
					className={
						severity === 'critical'
							? 'text-destructive'
							: severity === 'warning'
							? 'text-warning'
							: 'text-info'
					}
				/>
				<div className='flex-1 space-y-1'>
					<div className='flex items-center gap-2'>
						<h4 className='text-sm font-semibold leading-none'>
							{title}
						</h4>
						<AlertStatusBadge status={severity} />
					</div>
					<div className='flex items-center gap-2 text-xs text-muted-foreground'>
						<Clock className='h-3 w-3' />
						{formatDistanceToNow(timestamp, { addSuffix: true })}
					</div>
				</div>
			</CardHeader>
			<CardContent className='pb-4'>
				<p className='text-sm text-muted-foreground'>{message}</p>
				<div className='mt-2 flex gap-2 text-xs'>
					<span className='font-medium'>{contractName}</span>
					<span className='text-muted-foreground'>•</span>
					<span className='text-muted-foreground'>{ruleName}</span>
				</div>
			</CardContent>
		</Card>
	);
}
