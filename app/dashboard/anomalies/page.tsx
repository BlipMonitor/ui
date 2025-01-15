'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { AlertCircle, CalendarIcon, RefreshCcw } from 'lucide-react';
import { format } from 'date-fns';
import { columns, type Anomaly, type Severity } from './columns';
import { DataTable } from './data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AnomalyDetailsDrawer } from '@/components/anomalies/anomaly-details-drawer';

// Mock data - replace with API call later
const mockAnomalies: Anomaly[] = [
	{
		id: '1',
		timestamp: new Date('2024-01-15T10:30:00Z'),
		type: 'Gas Usage Spike',
		description: 'Gas usage 250% above baseline',
		severity: 'high',
		status: 'active',
		metric: '2.5M gas',
		threshold: '1M gas',
	},
	{
		id: '2',
		timestamp: new Date('2024-01-15T09:15:00Z'),
		type: 'Error Rate Surge',
		description: 'Error rate increased to 15%',
		severity: 'critical',
		status: 'active',
		metric: '15%',
		threshold: '5%',
	},
];

export default function AnomaliesPage() {
	const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
	const [date, setDate] = useState<Date>();
	const [severity, setSeverity] = useState<'all' | Severity>('all');
	const [status, setStatus] = useState<'all' | 'active' | 'resolved'>('all');
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(
		null
	);
	const [drawerOpen, setDrawerOpen] = useState(false);

	// Load mock data
	useEffect(() => {
		try {
			setAnomalies(mockAnomalies);
			setIsLoading(false);
		} catch {
			setError('Failed to load anomalies data');
			setIsLoading(false);
		}
	}, []);

	const filteredAnomalies = anomalies.filter((anomaly) => {
		// Filter by severity
		if (severity !== 'all' && anomaly.severity !== severity) {
			return false;
		}

		// Filter by status
		if (status !== 'all' && anomaly.status !== status) {
			return false;
		}

		// Filter by date if selected
		if (date) {
			const anomalyDate = new Date(anomaly.timestamp);
			return (
				anomalyDate.getFullYear() === date.getFullYear() &&
				anomalyDate.getMonth() === date.getMonth() &&
				anomalyDate.getDate() === date.getDate()
			);
		}

		return true;
	});

	const handleRowClick = (anomaly: Anomaly) => {
		setSelectedAnomaly(anomaly);
		setDrawerOpen(true);
	};

	const handleRefresh = () => {
		setIsLoading(true);
		setError(null);
		try {
			setAnomalies(mockAnomalies);
			setIsLoading(false);
		} catch {
			setError('Failed to refresh anomalies data');
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return (
			<div className='flex flex-1 flex-col gap-4 p-4'>
				<div className='flex items-center justify-between'>
					<Skeleton className='h-6 w-32' />
					<div className='flex items-center gap-2'>
						<Skeleton className='h-9 w-[240px]' />
						<Skeleton className='h-9 w-[300px]' />
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

	return (
		<div className='flex flex-1 flex-col gap-4 p-4'>
			<div className='flex items-center justify-between'>
				<h1 className='text-lg font-medium'>Anomalies</h1>
				<div className='flex items-center gap-4'>
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
									format(date, 'PPP')
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

					<div className='flex flex-col gap-2'>
						<div className='text-sm font-medium text-muted-foreground'>
							Severity
						</div>
						<Tabs
							value={severity}
							onValueChange={(value) =>
								setSeverity(value as typeof severity)
							}
							className='w-[400px]'
						>
							<TabsList className='grid w-full grid-cols-5'>
								<TabsTrigger value='all'>All</TabsTrigger>
								<TabsTrigger value='low'>Low</TabsTrigger>
								<TabsTrigger value='medium'>Medium</TabsTrigger>
								<TabsTrigger value='high'>High</TabsTrigger>
								<TabsTrigger value='critical'>
									Critical
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>

					<div className='flex flex-col gap-2'>
						<div className='text-sm font-medium text-muted-foreground'>
							Status
						</div>
						<Tabs
							value={status}
							onValueChange={(value) =>
								setStatus(value as typeof status)
							}
							className='w-[300px]'
						>
							<TabsList className='grid w-full grid-cols-3'>
								<TabsTrigger value='all'>All</TabsTrigger>
								<TabsTrigger value='active'>Active</TabsTrigger>
								<TabsTrigger value='resolved'>
									Resolved
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>
				</div>
			</div>

			{error ? (
				<Alert variant='destructive'>
					<AlertCircle className='h-4 w-4' />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription className='flex items-center justify-between'>
						<span>{error}</span>
						<Button
							variant='outline'
							size='sm'
							onClick={handleRefresh}
						>
							<RefreshCcw className='mr-2 h-4 w-4' />
							Retry
						</Button>
					</AlertDescription>
				</Alert>
			) : (
				<>
					<DataTable
						columns={columns}
						data={filteredAnomalies}
						onRowClick={handleRowClick}
					/>
					<AnomalyDetailsDrawer
						anomaly={selectedAnomaly}
						open={drawerOpen}
						onOpenChange={setDrawerOpen}
					/>
				</>
			)}
		</div>
	);
}
