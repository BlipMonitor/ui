import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

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
		<Card className='h-full transition-colors hover:bg-accent/50'>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
				<Icon className='h-4 w-4 text-muted-foreground' />
				{trend && (
					<span
						className={`text-sm ${
							trend.isPositive
								? 'text-success'
								: 'text-destructive'
						}`}
					>
						{trend.value > 0 ? '+' : ''}
						{trend.value}%
					</span>
				)}
			</CardHeader>
			<CardContent className='space-y-1'>
				<div className='text-2xl font-bold'>{value}</div>
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
			>
				{content}
			</Link>
		);
	}

	return content;
}
