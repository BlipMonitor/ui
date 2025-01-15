'use client';

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getPaginationRowModel,
	SortingState,
	getSortedRowModel,
} from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { type Anomaly } from './columns';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	onRowClick?: (data: TData) => void;
}

export function DataTable<TData extends Anomaly, TValue>({
	columns,
	data,
	onRowClick,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([
		{
			id: 'timestamp',
			desc: true,
		},
	]);
	const [isFiltering, setIsFiltering] = useState(false);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		state: {
			sorting,
		},
	});

	// Simulate loading state when filters change
	useEffect(() => {
		setIsFiltering(true);
		const timer = setTimeout(() => setIsFiltering(false), 500);
		return () => clearTimeout(timer);
	}, [sorting]);

	return (
		<div>
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef
															.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{isFiltering ? (
							Array.from({ length: 5 }).map((_, index) => (
								<TableRow key={index}>
									{columns.map((_, cellIndex) => (
										<TableCell key={cellIndex}>
											<Skeleton className='h-6 w-[100px]' />
										</TableCell>
									))}
								</TableRow>
							))
						) : table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={
										row.getIsSelected() && 'selected'
									}
									className={cn(
										onRowClick &&
											'cursor-pointer hover:bg-muted/50',
										// Add subtle highlight for critical anomalies
										row.original.severity === 'critical' &&
											'bg-red-500/5'
									)}
									onClick={() => onRowClick?.(row.original)}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center text-muted-foreground'
								>
									No anomalies found. Try adjusting your
									filters.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className='flex items-center justify-end space-x-2 py-4'>
				<Button
					variant='outline'
					size='sm'
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Previous
				</Button>
				<Button
					variant='outline'
					size='sm'
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Next
				</Button>
			</div>
		</div>
	);
}
