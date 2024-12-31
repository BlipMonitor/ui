'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { TrendingUp } from 'lucide-react';

import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import {
	chartContainerClass,
	commonAxisConfig,
	commonGridConfig,
	formatDate,
	useTimeRange,
	ChartCard,
} from './chart-utils';

// Sample data - we'll replace this with real success rate data later
const chartData = [
	{ date: '2024-12-01', success: 85, failed: 15 },
	{ date: '2024-12-02', success: 88, failed: 12 },
	{ date: '2024-12-03', success: 90, failed: 10 },
	{ date: '2024-12-04', success: 86, failed: 14 },
	{ date: '2024-12-05', success: 89, failed: 11 },
	{ date: '2024-12-06', success: 87, failed: 13 },
];

const chartConfig = {
	success: {
		label: 'Success',
		color: 'hsl(var(--chart-2))',
	},
	failed: {
		label: 'Failed',
		color: 'hsl(var(--chart-3))',
	},
} satisfies ChartConfig;

export function SuccessRateChart() {
	const { timeRange, setTimeRange, filterDataByTimeRange } = useTimeRange();
	const filteredData = filterDataByTimeRange(chartData);

	const averageSuccessRate = Math.round(
		filteredData.reduce((acc, curr) => acc + curr.success, 0) /
			filteredData.length
	);

	const totalTransactions = filteredData.reduce(
		(acc, curr) => acc + curr.success + curr.failed,
		0
	);

	return (
		<ChartCard
			title='Success Rate'
			description='Contract call success vs failure rate'
			timeRange={timeRange}
			onTimeRangeChange={setTimeRange}
			footer={
				<div className='flex w-full flex-col items-start gap-2 text-sm'>
					<div className='flex items-center gap-2 font-medium leading-none'>
						{averageSuccessRate}% average success rate{' '}
						<TrendingUp className='h-4 w-4' />
					</div>
					<div className='text-muted-foreground'>
						{totalTransactions} total transactions
					</div>
				</div>
			}
		>
			<ChartContainer
				config={chartConfig}
				className={chartContainerClass}
			>
				<BarChart
					data={filteredData}
					margin={{
						left: 12,
						right: 12,
					}}
					stackOffset='expand'
					accessibilityLayer
				>
					<CartesianGrid {...commonGridConfig} />
					<XAxis
						{...commonAxisConfig}
						dataKey='date'
						minTickGap={32}
						tickFormatter={formatDate}
					/>
					<YAxis
						{...commonAxisConfig}
						tickFormatter={(value) => `${Math.round(value * 100)}%`}
					/>
					<ChartTooltip
						cursor={false}
						content={
							<ChartTooltipContent labelFormatter={formatDate} />
						}
					/>
					<Bar
						dataKey='success'
						stackId='a'
						fill='hsl(var(--chart-2))'
					/>
					<Bar
						dataKey='failed'
						stackId='a'
						fill='hsl(var(--chart-3))'
						radius={[4, 4, 0, 0]}
					/>
				</BarChart>
			</ChartContainer>
		</ChartCard>
	);
}
