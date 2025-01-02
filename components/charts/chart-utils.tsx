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
import { format } from 'date-fns';

export type TimeRange = '7d' | '30d' | '90d';

// Common time range options
export const timeRangeOptions = [
	{ value: '90d' as const, label: 'Last 3 months', days: 90 },
	{ value: '30d' as const, label: 'Last 30 days', days: 30 },
	{ value: '7d' as const, label: 'Last 7 days', days: 7 },
] as const;

// Add this for testing empty states
const TEST_MODE = true;

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
export interface ChartCardProps {
	children: React.ReactNode;
	title: string;
	description?: React.ReactNode;
	timeRange?: TimeRange;
	onTimeRangeChange?: (range: TimeRange) => void;
	footer?: React.ReactNode;
	action?: React.ReactNode;
}

export function ChartCard({
	children,
	title,
	description,
	timeRange,
	onTimeRangeChange,
	footer,
	action,
}: ChartCardProps) {
	return (
		<Card>
			<CardHeader>
				<div className='flex items-center justify-between'>
					<div>
						<CardTitle>{title}</CardTitle>
						{description && (
							<CardDescription>{description}</CardDescription>
						)}
					</div>
					<div className='flex items-center space-x-2'>
						{action}
						{timeRange && onTimeRangeChange && (
							<TimeRangeSelect
								value={timeRange}
								onChange={onTimeRangeChange}
							/>
						)}
					</div>
				</div>
			</CardHeader>
			<CardContent>{children}</CardContent>
			{footer && <CardFooter>{footer}</CardFooter>}
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

function TimeRangeSelect({
	value,
	onChange,
}: {
	value: TimeRange;
	onChange: (value: TimeRange) => void;
}) {
	return (
		<Select
			value={value}
			onValueChange={onChange}
		>
			<SelectTrigger
				className='w-[160px] rounded-lg'
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
	);
}

export function filterDataByTimeRange<T extends { timestamp: string }>(
	data: T[],
	timeRange: TimeRange
): T[] {
	// For testing empty states
	if (TEST_MODE && timeRange === '30d') {
		return [];
	}

	const now = new Date();
	const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
	const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

	return data.filter((item) => new Date(item.timestamp) >= startDate);
}

export function groupDataByDate<T extends { timestamp: string }, R>(
	data: T[],
	reducer: (items: T[]) => R
): (R & { date: string })[] {
	const groups = data.reduce((acc, item) => {
		const date = format(new Date(item.timestamp), 'yyyy-MM-dd');
		if (!acc[date]) {
			acc[date] = [];
		}
		acc[date].push(item);
		return acc;
	}, {} as Record<string, T[]>);

	return Object.entries(groups)
		.map(([date, items]) => ({
			date,
			...reducer(items),
		}))
		.sort((a, b) => a.date.localeCompare(b.date));
}
