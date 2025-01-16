'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// This type is used to define the shape of our data.
export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type Status = 'active' | 'resolved';

export interface Anomaly {
	id: string;
	timestamp: Date;
	type: string;
	description: string;
	severity: Severity;
	status: Status;
	metric?: string;
	threshold?: string;
}

const severityColors: Record<Severity, string> = {
	low: 'bg-green-500/10 text-green-500 dark:bg-green-900/30 dark:text-green-400',
	medium: 'bg-yellow-500/10 text-yellow-500 dark:bg-yellow-900/30 dark:text-yellow-400',
	high: 'bg-orange-500/10 text-orange-500 dark:bg-orange-900/30 dark:text-orange-400',
	critical: 'bg-red-500/10 text-red-500 dark:bg-red-900/30 dark:text-red-400',
};

export const columns: ColumnDef<Anomaly>[] = [
	{
		accessorKey: 'timestamp',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className='px-0 hover:bg-transparent'
				>
					Time
					{column.getIsSorted() === 'asc' ? (
						<ArrowUp className='ml-2 h-4 w-4' />
					) : column.getIsSorted() === 'desc' ? (
						<ArrowDown className='ml-2 h-4 w-4' />
					) : (
						<ArrowUpDown className='ml-2 h-4 w-4' />
					)}
				</Button>
			);
		},
		cell: ({ row }) => {
			return format(row.getValue('timestamp'), 'MMM d, yyyy HH:mm:ss');
		},
	},
	{
		accessorKey: 'type',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className='px-0 hover:bg-transparent'
				>
					Type
					{column.getIsSorted() === 'asc' ? (
						<ArrowUp className='ml-2 h-4 w-4' />
					) : column.getIsSorted() === 'desc' ? (
						<ArrowDown className='ml-2 h-4 w-4' />
					) : (
						<ArrowUpDown className='ml-2 h-4 w-4' />
					)}
				</Button>
			);
		},
	},
	{
		accessorKey: 'description',
		header: 'Description',
	},
	{
		accessorKey: 'severity',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className='px-0 hover:bg-transparent'
				>
					Severity
					{column.getIsSorted() === 'asc' ? (
						<ArrowUp className='ml-2 h-4 w-4' />
					) : column.getIsSorted() === 'desc' ? (
						<ArrowDown className='ml-2 h-4 w-4' />
					) : (
						<ArrowUpDown className='ml-2 h-4 w-4' />
					)}
				</Button>
			);
		},
		cell: ({ row }) => {
			const severity = row.getValue('severity') as Severity;
			return (
				<Badge
					variant='secondary'
					className={cn(severityColors[severity])}
				>
					{severity}
				</Badge>
			);
		},
	},
	{
		accessorKey: 'status',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className='px-0 hover:bg-transparent'
				>
					Status
					{column.getIsSorted() === 'asc' ? (
						<ArrowUp className='ml-2 h-4 w-4' />
					) : column.getIsSorted() === 'desc' ? (
						<ArrowDown className='ml-2 h-4 w-4' />
					) : (
						<ArrowUpDown className='ml-2 h-4 w-4' />
					)}
				</Button>
			);
		},
		cell: ({ row }) => {
			const status = row.getValue('status') as Status;
			return (
				<Badge
					variant='secondary'
					className={cn(
						status === 'active'
							? 'bg-blue-500/10 text-blue-500 dark:bg-blue-900/30 dark:text-blue-400'
							: 'bg-gray-500/10 text-gray-500 dark:bg-gray-900/30 dark:text-gray-400'
					)}
				>
					{status}
				</Badge>
			);
		},
	},
];
