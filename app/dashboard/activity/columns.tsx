'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

// This type is used to define the shape of our data.
export type ActivityEvent = {
	id: string;
	timestamp: Date;
	function: string;
	outcome: 'success' | 'failure';
	gasUsed: string;
	executionTime: string;
	transactionId: string;
	blockNumber: string;
	errorMessage?: string;
};

export const columns: ColumnDef<ActivityEvent>[] = [
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
					Timestamp
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
		accessorKey: 'function',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className='px-0 hover:bg-transparent'
				>
					Function
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
		accessorKey: 'outcome',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className='px-0 hover:bg-transparent'
				>
					Outcome
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
			const outcome = row.getValue('outcome') as string;
			return (
				<span
					className={cn(
						'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
						outcome === 'success'
							? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
							: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
					)}
				>
					{outcome}
				</span>
			);
		},
	},
	{
		accessorKey: 'gasUsed',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className='px-0 hover:bg-transparent'
				>
					Gas Used
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
		accessorKey: 'executionTime',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className='px-0 hover:bg-transparent'
				>
					Execution Time
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
];
