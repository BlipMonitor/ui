import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

interface MetricCardProps {
	title: string;
	value: string | number;
	description?: string;
	icon: LucideIcon;
	trend?: {
		value: number;
		isPositive: boolean;
	};
	href?: string;
}

export function MetricCard({
	title,
	value,
	description,
	icon: Icon,
	trend,
	href,
}: MetricCardProps) {
	const content = (
		<Card
			className='h-full transition-colors hover:bg-accent/50'
			role='article'
			aria-label={`${title} metric card showing ${value}`}
		>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
				<Icon
					className='h-4 w-4 text-muted-foreground'
					aria-hidden='true'
				/>
				{trend && (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<span
									className={cn('text-sm font-medium', {
										'text-emerald-500': trend.isPositive,
										'text-rose-500': !trend.isPositive,
									})}
									role='status'
									aria-label={`Trend ${
										trend.value > 0 ? 'up' : 'down'
									} by ${Math.abs(trend.value)}% - ${
										trend.isPositive
											? 'positive'
											: 'negative'
									} change`}
								>
									{trend.value > 0 ? '+' : ''}
									{trend.value}%
								</span>
							</TooltipTrigger>
							<TooltipContent>
								<p>
									{trend.isPositive ? 'Improved' : 'Declined'}{' '}
									by {Math.abs(trend.value)}%
									<br />
									compared to previous period
								</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}
			</CardHeader>
			<CardContent className='space-y-1'>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<div className='text-2xl font-bold'>{value}</div>
						</TooltipTrigger>
						<TooltipContent>
							<p>Current {title.toLowerCase()}</p>
							{description && (
								<p className='text-xs opacity-90'>
									{description}
								</p>
							)}
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
				<p className='text-xs text-muted-foreground'>{title}</p>
				{description && (
					<p className='text-xs text-muted-foreground'>
						{description}
					</p>
				)}
			</CardContent>
		</Card>
	);

	if (href) {
		return (
			<Link
				href={href}
				className='block'
				aria-label={`View detailed ${title.toLowerCase()} metrics`}
			>
				{content}
			</Link>
		);
	}

	return content;
}
