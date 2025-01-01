'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Copy } from 'lucide-react';

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EventDetailsDrawerProps {
	event: {
		id: string;
		timestamp: Date;
		function: string;
		outcome: 'success' | 'failure';
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
			<SheetContent className='w-full sm:max-w-xl'>
				<SheetHeader>
					<SheetTitle>Event Details</SheetTitle>
					<SheetDescription>
						Detailed information about this contract event.
					</SheetDescription>
				</SheetHeader>

				<div className='mt-6 space-y-6'>
					{/* Basic Info */}
					<div className='space-y-2'>
						<h3 className='text-sm font-medium text-muted-foreground'>
							Basic Information
						</h3>
						<div className='grid gap-4 rounded-lg border p-4'>
							<div className='grid grid-cols-3 items-center gap-4'>
								<span className='text-sm'>Function</span>
								<span className='col-span-2 font-mono font-medium'>
									{event.function}
								</span>
							</div>
							<div className='grid grid-cols-3 items-center gap-4'>
								<span className='text-sm'>Timestamp</span>
								<span className='col-span-2 font-mono'>
									{format(event.timestamp, 'PPpp')}
								</span>
							</div>
							<div className='grid grid-cols-3 items-center gap-4'>
								<span className='text-sm'>Status</span>
								<Badge
									variant={
										event.outcome === 'success'
											? 'default'
											: 'destructive'
									}
									className={cn(
										'capitalize',
										event.outcome === 'success' &&
											'bg-green-500 text-white hover:bg-green-500/80 dark:bg-green-900 dark:hover:bg-green-900/80'
									)}
								>
									{event.outcome}
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
							<div className='grid grid-cols-3 items-center gap-4'>
								<span className='text-sm'>Gas Used</span>
								<span className='col-span-2 font-mono'>
									{event.gasUsed}
								</span>
							</div>
							<div className='grid grid-cols-3 items-center gap-4'>
								<span className='text-sm'>Execution Time</span>
								<span className='col-span-2 font-mono'>
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
								<div className='grid grid-cols-3 items-center gap-4'>
									<span className='text-sm'>
										Transaction ID
									</span>
									<div className='col-span-2 flex items-center gap-2'>
										<span className='font-mono text-sm'>
											{event.transactionId}
										</span>
										<Button
											variant='ghost'
											size='icon'
											className='h-6 w-6'
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
								<div className='grid grid-cols-3 items-center gap-4'>
									<span className='text-sm'>
										Block Number
									</span>
									<span className='col-span-2 font-mono'>
										{event.blockNumber}
									</span>
								</div>
							)}
						</div>
					</div>

					{/* Error Details (if any) */}
					{event.outcome === 'failure' && event.errorMessage && (
						<div className='space-y-2'>
							<h3 className='text-sm font-medium text-muted-foreground'>
								Error Details
							</h3>
							<div className='rounded-lg border border-destructive/20 bg-destructive/10 p-4'>
								<pre className='whitespace-pre-wrap text-sm text-destructive'>
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
