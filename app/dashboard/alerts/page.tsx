'use client';

import { useEffect, useState } from 'react';
import { Alert, generateMockAlerts } from '@/lib/mock/alerts';
import { NoAlerts } from '@/components/alerts/no-alerts';
import { Skeleton } from '@/components/ui/skeleton';
import {
	Alert as AlertUI,
	AlertDescription,
	AlertTitle,
} from '@/components/ui/alert';
import { AlertCircle, CalendarIcon, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { columns } from './columns';
import { DataTable } from './data-table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { format, isToday, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { AddRuleDialog } from '@/components/alerts/add-rule-dialog';

export default function AlertsPage() {
	const [alerts, setAlerts] = useState<Alert[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [statusFilter, setStatusFilter] = useState<
		'all' | 'active' | 'resolved'
	>('all');
	const [date, setDate] = useState<Date>();

	useEffect(() => {
		// Simulate API call delay
		const timer = setTimeout(() => {
			try {
				setAlerts(generateMockAlerts(50));
				setIsLoading(false);
			} catch (error) {
				setError(
					error instanceof Error
						? error.message
						: 'Failed to load alerts. Please try again.'
				);
				setIsLoading(false);
			}
		}, 1000);

		return () => clearTimeout(timer);
	}, []);

	const handleAlertClick = (alert: Alert) => {
		// We'll implement the drawer in Issue #40
		console.log('Alert clicked:', alert);
	};

	const filteredAlerts = alerts
		.filter((alert) => {
			// First filter by status
			if (statusFilter !== 'all' && alert.status !== statusFilter) {
				return false;
			}

			// Then filter by date if selected
			if (date) {
				const alertDate = startOfDay(alert.triggeredAt);
				const selectedDate = startOfDay(date);
				return alertDate.getTime() === selectedDate.getTime();
			}

			return true;
		})
		.sort((a, b) => b.triggeredAt.getTime() - a.triggeredAt.getTime());

	if (isLoading) {
		return (
			<div className='flex flex-1 flex-col gap-4 p-4'>
				<div className='flex items-center justify-between'>
					<Skeleton className='h-6 w-32' />
					<div className='flex items-center gap-2'>
						<Skeleton className='h-9 w-[240px]' />
						<Skeleton className='h-9 w-[300px]' />
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
					<AddRuleDialog />
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
								setTimeout(() => {
									try {
										setAlerts(generateMockAlerts(50));
										setIsLoading(false);
									} catch (error) {
										setError(
											error instanceof Error
												? error.message
												: 'Failed to load alerts. Please try again.'
										);
										setIsLoading(false);
									}
								}, 1000);
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

	const renderFilters = () => (
		<div className='flex items-center gap-2'>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant='outline'
						className={cn(
							'w-[240px] justify-start text-left font-normal',
							!date && 'text-muted-foreground'
						)}
					>
						<CalendarIcon className='mr-2 h-4 w-4' />
						{date ? (
							isToday(date) ? (
								'Today'
							) : (
								format(date, 'PPP')
							)
						) : (
							<span>Pick a date</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className='w-auto p-0'
					align='end'
				>
					<Calendar
						mode='single'
						selected={date}
						onSelect={setDate}
						initialFocus
					/>
				</PopoverContent>
			</Popover>
			<ToggleGroup
				type='single'
				value={statusFilter}
				onValueChange={(value) =>
					setStatusFilter(value as typeof statusFilter)
				}
				className='justify-start'
			>
				<ToggleGroupItem
					value='all'
					aria-label='Show all alerts'
				>
					All Alerts
				</ToggleGroupItem>
				<ToggleGroupItem
					value='active'
					aria-label='Show active alerts'
				>
					Active
				</ToggleGroupItem>
				<ToggleGroupItem
					value='resolved'
					aria-label='Show resolved alerts'
				>
					Resolved
				</ToggleGroupItem>
			</ToggleGroup>
		</div>
	);

	if (!isLoading && filteredAlerts.length === 0) {
		return (
			<div className='flex flex-1 flex-col gap-4 p-4'>
				<div className='flex items-center justify-between'>
					<h1 className='text-lg font-medium'>Recent Alerts</h1>
					<div className='flex items-center gap-4'>
						{renderFilters()}
						<AddRuleDialog />
					</div>
				</div>
				<NoAlerts />
			</div>
		);
	}

	return (
		<div className='flex flex-1 flex-col gap-4 p-4'>
			<div className='flex items-center justify-between'>
				<h1 className='text-lg font-medium'>Recent Alerts</h1>
				<div className='flex items-center gap-4'>
					{renderFilters()}
					<AddRuleDialog />
				</div>
			</div>
			<DataTable
				columns={columns}
				data={filteredAlerts}
				onRowClick={handleAlertClick}
			/>
		</div>
	);
}
