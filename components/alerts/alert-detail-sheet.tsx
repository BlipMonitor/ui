import { Alert } from '@/lib/mock/alerts';
import { Button } from '@/components/ui/button';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

interface AlertDetailSheetProps {
	alert: Alert | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onAcknowledge: (alertId: string) => void;
	onResolve: (alertId: string) => void;
}

export function AlertDetailSheet({
	alert,
	open,
	onOpenChange,
	onAcknowledge,
	onResolve,
}: AlertDetailSheetProps) {
	const isActive = alert?.status === 'active';

	// Add keyboard shortcuts
	useEffect(() => {
		if (!open || !alert) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			// ESC is handled by Sheet component
			if (e.key === 'a' && isActive) {
				onAcknowledge(alert.id);
			} else if (e.key === 'r' && isActive) {
				onResolve(alert.id);
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [open, isActive, alert, onAcknowledge, onResolve]);

	if (!alert) return null;

	return (
		<Sheet
			open={open}
			onOpenChange={onOpenChange}
		>
			<SheetContent className='w-full sm:max-w-xl'>
				<SheetHeader className='space-y-4'>
					<div className='flex items-center justify-between'>
						<SheetTitle className='text-lg font-semibold'>
							Alert Details
						</SheetTitle>
						<Badge
							variant={isActive ? 'destructive' : 'default'}
							className={cn(
								'px-2 py-0.5',
								isActive &&
									'bg-red-500/15 text-red-500 hover:bg-red-500/25'
							)}
						>
							{alert.status.charAt(0).toUpperCase() +
								alert.status.slice(1)}
						</Badge>
					</div>
				</SheetHeader>

				<ScrollArea className='h-[calc(100vh-8rem)] pr-4'>
					<div className='space-y-6 py-6'>
						{/* Alert Summary */}
						<div className='space-y-2'>
							<h3 className='text-sm font-medium text-muted-foreground'>
								Summary
							</h3>
							<p className='text-sm'>{alert.summary}</p>
						</div>

						{/* Alert Details */}
						<div className='space-y-4'>
							<h3 className='text-sm font-medium text-muted-foreground'>
								Details
							</h3>
							<div className='grid gap-4'>
								<div className='flex items-center gap-2'>
									<AlertCircle className='h-4 w-4 text-muted-foreground' />
									<span className='text-sm font-medium'>
										{alert.name}
									</span>
								</div>
								<div className='flex items-center gap-2'>
									<Clock className='h-4 w-4 text-muted-foreground' />
									<span className='text-sm'>
										Triggered{' '}
										{formatDistanceToNow(alert.triggeredAt)}{' '}
										ago
									</span>
								</div>
								{alert.resolvedAt && (
									<div className='flex items-center gap-2'>
										<CheckCircle2 className='h-4 w-4 text-muted-foreground' />
										<span className='text-sm'>
											Resolved{' '}
											{formatDistanceToNow(
												alert.resolvedAt
											)}{' '}
											ago
										</span>
									</div>
								)}
							</div>
						</div>

						{/* Network Info */}
						<div className='space-y-2'>
							<h3 className='text-sm font-medium text-muted-foreground'>
								Network
							</h3>
							<Badge
								variant='outline'
								className={cn(
									'px-2 py-0.5',
									alert.network === 'mainnet'
										? 'bg-primary/10 text-primary hover:bg-primary/20'
										: alert.network === 'testnet'
										? 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20'
										: 'bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20'
								)}
							>
								{alert.network.charAt(0).toUpperCase() +
									alert.network.slice(1)}
							</Badge>
						</div>

						{/* Contract Info */}
						<div className='space-y-2'>
							<h3 className='text-sm font-medium text-muted-foreground'>
								Contract
							</h3>
							<p className='break-all rounded-md bg-muted px-3 py-2 text-sm font-mono'>
								{alert.contractAddress}
							</p>
						</div>

						{/* Timeline */}
						<div className='space-y-4'>
							<h3 className='text-sm font-medium text-muted-foreground'>
								Timeline
							</h3>
							<div className='space-y-4'>
								<div className='flex gap-4'>
									<div className='relative flex flex-col items-center'>
										<div className='h-2 w-2 rounded-full bg-red-500' />
										<div className='h-full w-px bg-border' />
									</div>
									<div className='flex-1 space-y-1 pb-8'>
										<p className='text-sm'>
											Alert Triggered
										</p>
										<time className='text-sm text-muted-foreground'>
											{alert.triggeredAt.toLocaleString()}
										</time>
									</div>
								</div>

								{alert.resolvedAt && (
									<div className='flex gap-4'>
										<div className='relative flex flex-col items-center'>
											<div className='h-2 w-2 rounded-full bg-green-500' />
										</div>
										<div className='flex-1 space-y-1'>
											<p className='text-sm'>
												Alert Resolved
											</p>
											<time className='text-sm text-muted-foreground'>
												{alert.resolvedAt.toLocaleString()}
											</time>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</ScrollArea>

				{isActive && (
					<div className='flex items-center gap-2 pt-4'>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant='outline'
										className='flex-1'
										onClick={() => onAcknowledge(alert.id)}
									>
										Acknowledge
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<div className='flex items-center gap-1'>
										Press{' '}
										<kbd className='pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border px-1.5 font-mono text-[10px] font-medium opacity-100'>
											A
										</kbd>{' '}
										to acknowledge
									</div>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										className='flex-1'
										onClick={() => onResolve(alert.id)}
									>
										Resolve
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<div className='flex items-center gap-1'>
										Press{' '}
										<kbd className='pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border px-1.5 font-mono text-[10px] font-medium opacity-100'>
											R
										</kbd>
										to resolve
									</div>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}
