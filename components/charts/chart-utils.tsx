'use client';

import * as React from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

export type TimeRange = '7d' | '30d' | '90d';

// Common time range options
export const timeRangeOptions = [
	{ value: '90d', label: 'Last 3 months' },
	{ value: '30d', label: 'Last 30 days' },
	{ value: '7d', label: 'Last 7 days' },
] as const;

// Hook for time range selection
export function useTimeRange() {
	const [timeRange, setTimeRange] = React.useState<TimeRange>('90d');

	const filterDataByTimeRange = <T extends { date: string }>(data: T[]) => {
		return data.filter((item) => {
			const date = new Date(item.date);
			const referenceDate = new Date();
			let daysToSubtract = 90;
			if (timeRange === '30d') {
				daysToSubtract = 30;
			} else if (timeRange === '7d') {
				daysToSubtract = 7;
			}
			const startDate = new Date(referenceDate);
			startDate.setDate(startDate.getDate() - daysToSubtract);
			return date >= startDate;
		});
	};

	return {
		timeRange,
		setTimeRange,
		filterDataByTimeRange,
	};
}

// Common date formatting function
export function formatDate(value: string) {
	return new Date(value).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
	});
}

// Reusable chart card layout
interface ChartCardProps {
	title: string;
	description: string;
	timeRange: TimeRange;
	onTimeRangeChange: (value: TimeRange) => void;
	children: React.ReactNode;
	footer: React.ReactNode;
}

export function ChartCard({
	title,
	description,
	timeRange,
	onTimeRangeChange,
	children,
	footer,
}: ChartCardProps) {
	return (
		<Card>
			<CardHeader className='flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row'>
				<div className='grid flex-1 gap-1 text-center sm:text-left'>
					<CardTitle>{title}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</div>
				<Select
					value={timeRange}
					onValueChange={onTimeRangeChange}
				>
					<SelectTrigger
						className='w-[160px] rounded-lg sm:ml-auto'
						aria-label='Select time range'
					>
						<SelectValue placeholder='Last 3 months' />
					</SelectTrigger>
					<SelectContent className='rounded-xl'>
						{timeRangeOptions.map((option) => (
							<SelectItem
								key={option.value}
								value={option.value}
								className='rounded-lg'
							>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</CardHeader>
			<CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
				{children}
			</CardContent>
			<CardFooter>{footer}</CardFooter>
		</Card>
	);
}

// Common chart container configuration
export const chartContainerClass = 'aspect-auto h-[250px] w-full';

// Common axis configuration
export const commonAxisConfig = {
	tickLine: false,
	axisLine: false,
	tickMargin: 8,
} as const;

// Common grid configuration
export const commonGridConfig = {
	vertical: false,
} as const;
