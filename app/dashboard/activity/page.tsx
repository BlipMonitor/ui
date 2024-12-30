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
import { CalendarIcon, Filter } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { columns } from './columns';
import { DataTable } from './data-table';

// Sample data - replace with real data later
const sampleEvents = [
	{
		id: '1',
		timestamp: new Date('2024-02-20T10:30:00'),
		function: 'transfer',
		outcome: 'success' as const,
		gasUsed: '21,000',
		executionTime: '2.3s',
	},
	{
		id: '2',
		timestamp: new Date('2024-02-20T11:15:00'),
		function: 'swap',
		outcome: 'failure' as const,
		gasUsed: '45,000',
		executionTime: '3.1s',
	},
	{
		id: '3',
		timestamp: new Date('2024-02-20T12:00:00'),
		function: 'mint',
		outcome: 'success' as const,
		gasUsed: '32,000',
		executionTime: '1.8s',
	},
];

export default function ActivityPage() {
	const [date, setDate] = useState<Date>();
	const [outcome, setOutcome] = useState<'all' | 'success' | 'failure'>(
		'all'
	);

	const filteredEvents = sampleEvents.filter((event) => {
		if (outcome === 'all') return true;
		return event.outcome === outcome;
	});

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

			<DataTable
				columns={columns}
				data={filteredEvents}
			/>
		</div>
	);
}
