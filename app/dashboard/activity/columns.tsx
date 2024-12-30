'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// This type is used to define the shape of our data.
export type ActivityEvent = {
	id: string;
	timestamp: Date;
	function: string;
	outcome: 'success' | 'failure';
	gasUsed: string;
	executionTime: string;
};

export const columns: ColumnDef<ActivityEvent>[] = [
	{
		accessorKey: 'timestamp',
		header: 'Timestamp',
		cell: ({ row }) => {
			return format(row.getValue('timestamp'), 'MMM d, yyyy HH:mm:ss');
		},
	},
	{
		accessorKey: 'function',
		header: 'Function',
	},
	{
		accessorKey: 'outcome',
		header: 'Outcome',
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
		header: 'Gas Used',
	},
	{
		accessorKey: 'executionTime',
		header: 'Execution Time',
	},
];
