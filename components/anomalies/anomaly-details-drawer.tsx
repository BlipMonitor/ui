'use client';

import { type Anomaly } from '@/app/dashboard/anomalies/columns';
import { Button } from '@/components/ui/button';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetClose,
} from '@/components/ui/sheet';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AnomalyDetailsDrawerProps {
	anomaly: Anomaly | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const severityColors = {
	low: 'bg-blue-500/20 text-blue-700',
	medium: 'bg-yellow-500/20 text-yellow-700',
	high: 'bg-orange-500/20 text-orange-700',
	critical: 'bg-red-500/20 text-red-700',
};

const statusColors = {
	active: 'bg-red-500/20 text-red-700',
	resolved: 'bg-green-500/20 text-green-700',
};

export function AnomalyDetailsDrawer({
	anomaly,
	open,
	onOpenChange,
}: AnomalyDetailsDrawerProps) {
	if (!anomaly) return null;

	return (
		<Sheet
			open={open}
			onOpenChange={onOpenChange}
		>
			<SheetContent className='w-full overflow-y-auto p-0 sm:max-w-xl'>
				<div className='sticky top-0 z-20 border-b bg-background px-6 py-4'>
					<SheetHeader className='gap-2'>
						<div className='flex items-center justify-between'>
							<SheetTitle>Anomaly Details</SheetTitle>
							<SheetClose className='rounded-sm bg-secondary opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none'>
								<X className='h-4 w-4 text-secondary-foreground' />
								<span className='sr-only'>Close</span>
							</SheetClose>
						</div>
						<SheetDescription>
							Detected on{' '}
							{format(new Date(anomaly.timestamp), 'PPpp')}
						</SheetDescription>
					</SheetHeader>
				</div>

				<div className='space-y-6 px-6 py-4'>
					{/* Basic Info */}
					<div className='space-y-2'>
						<h3 className='text-sm font-medium text-muted-foreground'>
							Basic Information
						</h3>
						<div className='grid gap-4 rounded-lg border p-4'>
							<div className='grid grid-cols-1 sm:grid-cols-3 items-start gap-1 sm:items-center sm:gap-4'>
								<span className='text-sm font-medium sm:font-normal'>
									Type
								</span>
								<span className='sm:col-span-2 font-mono text-sm sm:text-base break-all'>
									{anomaly.type}
								</span>
							</div>
							<div className='grid grid-cols-1 sm:grid-cols-3 items-start gap-1 sm:items-center sm:gap-4'>
								<span className='text-sm font-medium sm:font-normal'>
									Description
								</span>
								<span className='sm:col-span-2 font-mono text-sm sm:text-base'>
									{anomaly.description}
								</span>
							</div>
							<div className='grid grid-cols-1 sm:grid-cols-3 items-start gap-1 sm:items-center sm:gap-4'>
								<span className='text-sm font-medium sm:font-normal'>
									Status
								</span>
								<Badge
									variant='secondary'
									className={cn(statusColors[anomaly.status])}
								>
									{anomaly.status}
								</Badge>
							</div>
							<div className='grid grid-cols-1 sm:grid-cols-3 items-start gap-1 sm:items-center sm:gap-4'>
								<span className='text-sm font-medium sm:font-normal'>
									Severity
								</span>
								<Badge
									variant='secondary'
									className={cn(
										severityColors[anomaly.severity]
									)}
								>
									{anomaly.severity}
								</Badge>
							</div>
						</div>
					</div>

					{/* Metrics */}
					<div className='space-y-2'>
						<h3 className='text-sm font-medium text-muted-foreground'>
							Metrics
						</h3>
						<div className='grid gap-4 rounded-lg border p-4'>
							<div className='grid grid-cols-1 sm:grid-cols-3 items-start gap-1 sm:items-center sm:gap-4'>
								<span className='text-sm font-medium sm:font-normal'>
									Current Value
								</span>
								<span className='sm:col-span-2 font-mono text-sm sm:text-base'>
									{anomaly.metric}
								</span>
							</div>
							<div className='grid grid-cols-1 sm:grid-cols-3 items-start gap-1 sm:items-center sm:gap-4'>
								<span className='text-sm font-medium sm:font-normal'>
									Threshold
								</span>
								<span className='sm:col-span-2 font-mono text-sm sm:text-base'>
									{anomaly.threshold}
								</span>
							</div>
						</div>
					</div>

					{/* Actions */}
					<div className='flex justify-end gap-2'>
						<Button
							variant='outline'
							onClick={() => onOpenChange(false)}
						>
							Close
						</Button>
						{anomaly.status === 'active' && (
							<Button>Mark as Resolved</Button>
						)}
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
