'use client';

import { Alert } from '@/lib/mock/alerts';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<Alert>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className='-ml-4'
				>
					Alert Type
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
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
					className='-ml-4'
				>
					Severity
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			const severity = row.getValue('severity') as string;
			const severityColors = {
				low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
				medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
				high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
				critical:
					'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
			};
			return (
				<Badge
					variant='outline'
					className={
						severityColors[severity as keyof typeof severityColors]
					}
				>
					{severity.charAt(0).toUpperCase() + severity.slice(1)}
				</Badge>
			);
		},
	},
	{
		accessorKey: 'network',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className='-ml-4'
				>
					Network
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			const network = row.getValue('network') as string;
			return network.charAt(0).toUpperCase() + network.slice(1);
		},
	},
	{
		accessorKey: 'triggeredAt',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className='-ml-4'
				>
					Triggered
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			return format(row.getValue('triggeredAt'), 'PPp');
		},
	},
	{
		accessorKey: 'resolvedAt',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className='-ml-4'
				>
					Resolved
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			const resolvedAt = row.getValue('resolvedAt') as Date | null;
			return resolvedAt ? format(resolvedAt, 'PPp') : '-';
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
					className='-ml-4'
				>
					Status
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			const status = row.getValue('status') as string;
			const statusColors = {
				active: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
				resolved:
					'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
			};
			return (
				<Badge
					variant='outline'
					className={
						statusColors[status as keyof typeof statusColors]
					}
				>
					{status.charAt(0).toUpperCase() + status.slice(1)}
				</Badge>
			);
		},
	},
];
