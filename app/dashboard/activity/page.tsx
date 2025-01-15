'use client';

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
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { columns, type ActivityEvent } from './columns';
import { DataTable } from './data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { EventDetailsDrawer } from '@/components/events/event-details-drawer';
import { FunctionFilter } from '@/components/events/function-filter';
import { generateMockEvents, type ContractEvent } from '@/lib/mock/events';

// Convert ContractEvent to ActivityEvent
function convertToActivityEvent(event: ContractEvent): ActivityEvent {
	return {
		id: event.id,
		timestamp: event.timestamp,
		function: event.functionName || event.type,
		status: event.status,
		gasUsed: event.gasUsed?.toLocaleString() || '-',
		executionTime: event.executionTime ? `${event.executionTime}ms` : '-',
		transactionId: event.transactionHash,
		blockNumber: event.transactionHash.slice(0, 8), // Mock block number from tx hash
		errorMessage: event.error,
	};
}

export default function ActivityPage() {
	const [events, setEvents] = useState<ActivityEvent[]>([]);
	const [date, setDate] = useState<Date>();
	const [status, setStatus] = useState<
		'all' | 'success' | 'failure' | 'pending'
	>('all');
	const [selectedFunctions, setSelectedFunctions] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedEvent, setSelectedEvent] = useState<ActivityEvent | null>(
		null
	);
	const [drawerOpen, setDrawerOpen] = useState(false);

	// Load mock data
	useEffect(() => {
		try {
			const mockEvents = generateMockEvents(50).map(
				convertToActivityEvent
			);
			setEvents(mockEvents);
			setIsLoading(false);
		} catch {
			setError('Failed to load activity data');
			setIsLoading(false);
		}
	}, []);

	// Extract unique function names from actual data
	const uniqueFunctions = Array.from(
		new Set(events.map((event) => event.function))
	).sort();

	const filteredEvents = events.filter((event) => {
		// First filter by status
		if (status !== 'all' && event.status !== status) {
			return false;
		}

		// Then filter by selected functions
		if (
			selectedFunctions.length > 0 &&
			!selectedFunctions.includes(event.function)
		) {
			return false;
		}

		// Then filter by date if selected
		if (date) {
			const eventDate = new Date(event.timestamp);
			return (
				eventDate.getFullYear() === date.getFullYear() &&
				eventDate.getMonth() === date.getMonth() &&
				eventDate.getDate() === date.getDate()
			);
		}

		return true;
	});

	const handleRowClick = (event: ActivityEvent) => {
		setSelectedEvent(event);
		setDrawerOpen(true);
	};

	const handleRefresh = () => {
		setIsLoading(true);
		setError(null);
		try {
			const mockEvents = generateMockEvents(50).map(
				convertToActivityEvent
			);
			setEvents(mockEvents);
			setIsLoading(false);
		} catch {
			setError('Failed to refresh activity data');
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
				<h1 className='text-lg font-medium'>Activity Feed</h1>
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
							Status
						</div>
						<Tabs
							value={status}
							onValueChange={(value) =>
								setStatus(value as typeof status)
							}
							className='w-[400px]'
						>
							<TabsList className='grid w-full grid-cols-4'>
								<TabsTrigger value='all'>
									All Events
								</TabsTrigger>
								<TabsTrigger value='success'>
									Success
								</TabsTrigger>
								<TabsTrigger value='failure'>
									Failures
								</TabsTrigger>
								<TabsTrigger value='pending'>
									Pending
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>

					<div className='flex flex-col gap-2'>
						<div className='text-sm font-medium text-muted-foreground'>
							Functions
						</div>
						<FunctionFilter
							functions={uniqueFunctions}
							selectedFunctions={selectedFunctions}
							onSelectionChange={setSelectedFunctions}
						/>
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
						data={filteredEvents}
						onRowClick={handleRowClick}
					/>
					<EventDetailsDrawer
						event={selectedEvent}
						open={drawerOpen}
						onOpenChange={setDrawerOpen}
					/>
				</>
			)}
		</div>
	);
}
