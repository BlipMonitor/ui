'use client';

import * as React from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface TopCall {
	id: string;
	timestamp: Date;
	function: string;
	value: number; // gas usage or execution time
	transactionId: string;
}

interface TopCallsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	type: 'gas' | 'execution' | 'memory';
	data: TopCall[];
}

export function TopCallsDialog({
	open,
	onOpenChange,
	type,
	data,
}: TopCallsDialogProps) {
	const [page, setPage] = React.useState(1);
	const itemsPerPage = 5;
	const totalPages = Math.ceil(data.length / itemsPerPage);

	const paginatedData = data.slice(
		(page - 1) * itemsPerPage,
		page * itemsPerPage
	);

	const getTitle = () => {
		switch (type) {
			case 'gas':
				return 'Gas Usage';
			case 'execution':
				return 'Execution Time';
			case 'memory':
				return 'Memory Usage';
		}
	};

	const getDescription = () => {
		switch (type) {
			case 'gas':
				return 'Contract calls that consumed the most gas';
			case 'execution':
				return 'Contract calls that took the longest to execute';
			case 'memory':
				return 'Contract calls that used the most memory';
		}
	};

	const formatValue = (value: number) => {
		switch (type) {
			case 'gas':
				return `${(value / 1000000).toFixed(2)}M`;
			case 'execution':
				return `${value.toFixed(2)}s`;
			case 'memory':
				return `${value.toFixed(2)}KB`;
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent className='max-w-3xl'>
				<DialogHeader>
					<DialogTitle>Top Calls by {getTitle()}</DialogTitle>
					<DialogDescription>{getDescription()}</DialogDescription>
				</DialogHeader>
				<div className='relative'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Timestamp</TableHead>
								<TableHead>Function</TableHead>
								<TableHead>{getTitle()}</TableHead>
								<TableHead>Transaction ID</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{paginatedData.map((call) => (
								<TableRow key={call.id}>
									<TableCell>
										{format(call.timestamp, 'PPp')}
									</TableCell>
									<TableCell className='font-mono'>
										{call.function}
									</TableCell>
									<TableCell>
										{formatValue(call.value)}
									</TableCell>
									<TableCell className='font-mono'>
										{call.transactionId}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					{totalPages > 1 && (
						<div className='flex items-center justify-end space-x-2 py-4'>
							<Button
								variant='outline'
								size='sm'
								onClick={() => setPage(page - 1)}
								disabled={page === 1}
							>
								Previous
							</Button>
							<Button
								variant='outline'
								size='sm'
								onClick={() => setPage(page + 1)}
								disabled={page === totalPages}
							>
								Next
							</Button>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
