import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
	title?: string;
	description?: string;
	action?: {
		label: string;
		onClick: () => void;
	};
	className?: string;
}

export function ErrorState({
	title = 'Something went wrong',
	description = 'An error occurred while loading the data. Please try again.',
	action,
	className,
}: ErrorStateProps) {
	return (
		<div
			className={cn(
				'flex h-[350px] flex-col items-center justify-center gap-4 rounded-lg border border-destructive/50 bg-card p-8 text-center',
				className
			)}
		>
			<AlertTriangle className='h-12 w-12 text-destructive/50' />
			<div className='space-y-2'>
				<h3 className='text-lg font-medium'>{title}</h3>
				<p className='text-sm text-muted-foreground'>{description}</p>
			</div>
			{action && (
				<Button
					variant='outline'
					onClick={action.onClick}
				>
					{action.label}
				</Button>
			)}
		</div>
	);
}
