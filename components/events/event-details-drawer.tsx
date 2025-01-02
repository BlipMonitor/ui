'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Copy, X } from 'lucide-react';

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EventDetailsDrawerProps {
	event: {
		id: string;
		timestamp: Date;
		function: string;
		status: 'success' | 'failure' | 'pending';
		gasUsed: string;
		executionTime: string;
		transactionId?: string;
		blockNumber?: string;
		errorMessage?: string;
	} | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function EventDetailsDrawer({
	event,
	open,
	onOpenChange,
}: EventDetailsDrawerProps) {
	if (!event) return null;

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
	};

	return (
		<Sheet
			open={open}
			onOpenChange={onOpenChange}
		>
			<SheetContent className='w-full overflow-y-auto p-0 sm:max-w-xl'>
				<div className='sticky top-0 z-20 border-b bg-background px-6 py-4'>
					<SheetHeader className='gap-2'>
						<div className='flex items-center justify-between'>
							<SheetTitle>Event Details</SheetTitle>
							<SheetClose className='rounded-sm bg-secondary opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none'>
								<X className='h-4 w-4 text-secondary-foreground' />
								<span className='sr-only'>Close</span>
							</SheetClose>
						</div>
						<SheetDescription>
							Detailed information about this contract event.
						</SheetDescription>
					</SheetHeader>
				</div>

				<div className='space-y-6 px-6 py-4'>
					{/* Basic Info */}
					<div className='space-y-2'>
						<h3 className='text-sm font-medium text-muted-foreground'>
							Basic Information
						</h3>
						<div className='grid gap-4 rounded-lg border p-4'>
							<div className='grid grid-cols-1 sm:grid-cols-3 items-start gap-1 sm:items-center sm:gap-4'>
								<span className='text-sm font-medium sm:font-normal'>
									Function
								</span>
								<span className='sm:col-span-2 font-mono text-sm sm:text-base break-all'>
									{event.function}
								</span>
							</div>
							<div className='grid grid-cols-1 sm:grid-cols-3 items-start gap-1 sm:items-center sm:gap-4'>
								<span className='text-sm font-medium sm:font-normal'>
									Timestamp
								</span>
								<span className='sm:col-span-2 font-mono text-sm sm:text-base'>
									{format(event.timestamp, 'PPpp')}
								</span>
							</div>
							<div className='grid grid-cols-1 sm:grid-cols-3 items-start gap-1 sm:items-center sm:gap-4'>
								<span className='text-sm font-medium sm:font-normal'>
									Status
								</span>
								<Badge
									variant={
										event.status === 'success'
											? 'default'
											: 'destructive'
									}
									className={cn(
										'capitalize w-fit',
										event.status === 'success' &&
											'bg-green-500 text-white hover:bg-green-500/80 dark:bg-green-900 dark:hover:bg-green-900/80'
									)}
								>
									{event.status}
								</Badge>
							</div>
						</div>
					</div>

					{/* Performance Metrics */}
					<div className='space-y-2'>
						<h3 className='text-sm font-medium text-muted-foreground'>
							Performance Metrics
						</h3>
						<div className='grid gap-4 rounded-lg border p-4'>
							<div className='grid grid-cols-1 sm:grid-cols-3 items-start gap-1 sm:items-center sm:gap-4'>
								<span className='text-sm font-medium sm:font-normal'>
									Gas Used
								</span>
								<span className='sm:col-span-2 font-mono text-sm sm:text-base'>
									{event.gasUsed}
								</span>
							</div>
							<div className='grid grid-cols-1 sm:grid-cols-3 items-start gap-1 sm:items-center sm:gap-4'>
								<span className='text-sm font-medium sm:font-normal'>
									Execution Time
								</span>
								<span className='sm:col-span-2 font-mono text-sm sm:text-base'>
									{event.executionTime}
								</span>
							</div>
						</div>
					</div>

					{/* Transaction Details */}
					<div className='space-y-2'>
						<h3 className='text-sm font-medium text-muted-foreground'>
							Transaction Details
						</h3>
						<div className='grid gap-4 rounded-lg border p-4'>
							{event.transactionId && (
								<div className='grid grid-cols-1 sm:grid-cols-3 items-start gap-1 sm:items-center sm:gap-4'>
									<span className='text-sm font-medium sm:font-normal'>
										Transaction ID
									</span>
									<div className='sm:col-span-2 flex items-center gap-2'>
										<span className='font-mono text-sm sm:text-base break-all'>
											{event.transactionId}
										</span>
										<Button
											variant='ghost'
											size='icon'
											className='h-6 w-6 shrink-0'
											onClick={() =>
												copyToClipboard(
													event.transactionId!
												)
											}
										>
											<Copy className='h-3 w-3' />
											<span className='sr-only'>
												Copy transaction ID
											</span>
										</Button>
									</div>
								</div>
							)}
							{event.blockNumber && (
								<div className='grid grid-cols-1 sm:grid-cols-3 items-start gap-1 sm:items-center sm:gap-4'>
									<span className='text-sm font-medium sm:font-normal'>
										Block Number
									</span>
									<span className='sm:col-span-2 font-mono text-sm sm:text-base'>
										{event.blockNumber}
									</span>
								</div>
							)}
						</div>
					</div>

					{/* Error Details (if any) */}
					{event.status === 'failure' && event.errorMessage && (
						<div className='space-y-2'>
							<h3 className='text-sm font-medium text-muted-foreground'>
								rror Details
							</h3>
							<div className='rounded-lg border border-destructive/20 bg-destructive/10 p-4'>
								<pre className='whitespace-pre-wrap text-sm text-destructive break-all'>
									{event.errorMessage}
								</pre>
							</div>
						</div>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}
