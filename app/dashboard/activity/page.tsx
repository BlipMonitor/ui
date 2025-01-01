'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { AlertCircle, CalendarIcon, Filter, RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { columns } from './columns';
import { DataTable } from './data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { EventDetailsDrawer } from '@/components/events/event-details-drawer';

// Sample data - replace with real data later
const sampleEvents = [
	{
		id: '1',
		timestamp: new Date('2024-02-20T10:30:00'),
		function: 'transfer',
		outcome: 'success' as const,
		gasUsed: '21,000',
		executionTime: '2.3s',
		transactionId: 'tx_0x1234567890abcdef',
		blockNumber: '12345678',
	},
	{
		id: '2',
		timestamp: new Date('2024-02-20T11:15:00'),
		function: 'swap',
		outcome: 'failure' as const,
		gasUsed: '45,000',
		executionTime: '3.1s',
		transactionId: 'tx_0xabcdef1234567890',
		blockNumber: '12345679',
		errorMessage: 'Insufficient liquidity for swap operation.',
	},
	{
		id: '3',
		timestamp: new Date('2024-02-20T12:00:00'),
		function: 'mint',
		outcome: 'success' as const,
		gasUsed: '32,000',
		executionTime: '1.8s',
		transactionId: 'tx_0x9876543210fedcba',
		blockNumber: '12345680',
	},
];

export default function ActivityPage() {
	const [date, setDate] = useState<Date>();
	const [outcome, setOutcome] = useState<'all' | 'success' | 'failure'>(
		'all'
	);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedEvent, setSelectedEvent] = useState<
		(typeof sampleEvents)[0] | null
	>(null);
	const [drawerOpen, setDrawerOpen] = useState(false);

	// Simulate loading and potential error for demo
	setTimeout(() => {
		setIsLoading(false);
	}, 1000);

	const filteredEvents = sampleEvents.filter((event) => {
		// First filter by outcome
		if (outcome !== 'all' && event.outcome !== outcome) {
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

	const handleRowClick = (event: (typeof sampleEvents)[0]) => {
		setSelectedEvent(event);
		setDrawerOpen(true);
	};

	if (isLoading) {
		return (
			<div className='flex flex-1 flex-col gap-4 p-4'>
				<div className='flex items-center justify-between'>
					<Skeleton className='h-6 w-32' />
					<div className='flex items-center gap-2'>
						<Skeleton className='h-9 w-[240px]' />
						<Skeleton className='h-9 w-24' />
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
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='outline'>
								<Filter className='mr-2 h-4 w-4' />
								Filter
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							<DropdownMenuLabel>
								Filter by Outcome
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem
									onClick={() => setOutcome('all')}
								>
									All
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => setOutcome('success')}
								>
									Success
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => setOutcome('failure')}
								>
									Failure
								</DropdownMenuItem>
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
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
							onClick={() => {
								setIsLoading(true);
								setError(null);
								// Simulate retry
								setTimeout(() => setIsLoading(false), 1000);
							}}
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
