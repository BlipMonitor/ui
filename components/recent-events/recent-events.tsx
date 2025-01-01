'use client';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Event {
	id: string;
	timestamp: Date;
	function: string;
	outcome: 'success' | 'failure';
	gasUsed: string;
	executionTime: string;
}

// Sample data - replace with real data later
const sampleEvents: Event[] = [
	{
		id: '1',
		timestamp: new Date('2024-02-20T10:30:00'),
		function: 'transfer',
		outcome: 'success',
		gasUsed: '21,000',
		executionTime: '2.3s',
	},
	{
		id: '2',
		timestamp: new Date('2024-02-20T11:15:00'),
		function: 'swap',
		outcome: 'failure',
		gasUsed: '45,000',
		executionTime: '3.1s',
	},
	{
		id: '3',
		timestamp: new Date('2024-02-20T12:00:00'),
		function: 'mint',
		outcome: 'success',
		gasUsed: '32,000',
		executionTime: '1.8s',
	},
	{
		id: '4',
		timestamp: new Date('2024-02-20T12:30:00'),
		function: 'transfer',
		outcome: 'success',
		gasUsed: '21,500',
		executionTime: '2.1s',
	},
	{
		id: '5',
		timestamp: new Date('2024-02-20T13:00:00'),
		function: 'burn',
		outcome: 'failure',
		gasUsed: '38,000',
		executionTime: '2.8s',
	},
];

export function RecentEvents() {
	return (
		<div className='space-y-4'>
			<div className='flex justify-between items-center'>
				<h2 className='text-lg font-medium'>Recent Events</h2>
				<Button
					variant='outline'
					asChild
				>
					<Link
						href='/dashboard/activity'
						className='gap-2'
					>
						View All
						<ArrowRight className='h-4 w-4' />
					</Link>
				</Button>
			</div>
			<div className='border rounded-md'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Date & Time</TableHead>
							<TableHead>Function</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Gas Used</TableHead>
							<TableHead>Execution Time</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{sampleEvents.map((event) => (
							<TableRow key={event.id}>
								<TableCell>
									{format(event.timestamp, 'MMM d, HH:mm:ss')}
								</TableCell>
								<TableCell className='font-medium'>
									{event.function}
								</TableCell>
								<TableCell>
									<span
										className={cn(
											'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
											event.outcome === 'success'
												? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
												: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
										)}
									>
										{event.outcome}
									</span>
								</TableCell>
								<TableCell className='text-muted-foreground'>
									{event.gasUsed}
								</TableCell>
								<TableCell className='text-muted-foreground'>
									{event.executionTime}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
