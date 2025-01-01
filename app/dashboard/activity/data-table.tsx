'use client';

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getPaginationRowModel,
	SortingState,
	getSortedRowModel,
	ColumnFiltersState,
	getFilteredRowModel,
} from '@tanstack/react-table';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	onRowClick?: (data: TData) => void;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	onRowClick,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [isFiltering, setIsFiltering] = useState(false);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters,
		},
	});

	// Simulate loading state when filters change
	useEffect(() => {
		setIsFiltering(true);
		const timer = setTimeout(() => setIsFiltering(false), 500);
		return () => clearTimeout(timer);
	}, [columnFilters, sorting]);

	return (
		<div>
			<div className='flex items-center pb-4'>
				<div className='relative max-w-sm'>
					<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
					<Input
						placeholder='Filter functions...'
						value={
							(table
								.getColumn('function')
								?.getFilterValue() as string) ?? ''
						}
						onChange={(event) =>
							table
								.getColumn('function')
								?.setFilterValue(event.target.value)
						}
						className='pl-8'
					/>
				</div>
			</div>

			<div className='border rounded-md'>
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
									className={
										onRowClick
											? 'cursor-pointer hover:bg-muted/50'
											: ''
									}
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
									className='h-20 text-center'
								>
									No matching events found. Try adjusting your
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
