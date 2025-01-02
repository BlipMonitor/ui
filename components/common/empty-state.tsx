import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
	icon?: LucideIcon;
	title: string;
	description?: string;
	action?: {
		label: string;
		onClick: () => void;
	};
	className?: string;
}

export function EmptyState({
	icon: Icon,
	title,
	description,
	action,
	className,
}: EmptyStateProps) {
	return (
		<div
			className={cn(
				'flex h-[350px] flex-col items-center justify-center gap-4 rounded-lg border bg-card p-8 text-center',
				className
			)}
		>
			{Icon && <Icon className='h-12 w-12 text-muted-foreground/50' />}
			<div className='space-y-2'>
				<h3 className='text-lg font-medium'>{title}</h3>
				{description && (
					<p className='text-sm text-muted-foreground'>
						{description}
					</p>
				)}
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
