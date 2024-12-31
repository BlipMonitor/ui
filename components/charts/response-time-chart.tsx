'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { TrendingDown } from 'lucide-react';

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

// Sample data - we'll replace this with real response time data later
const chartData = [
	{ date: '2024-12-01', responseTime: 120 },
	{ date: '2024-12-02', responseTime: 180 },
	{ date: '2024-12-03', responseTime: 150 },
	{ date: '2024-12-04', responseTime: 140 },
	{ date: '2024-12-05', responseTime: 130 },
	{ date: '2024-12-06', responseTime: 125 },
];

const chartConfig = {
	responseTime: {
		label: 'Response Time (ms)',
		color: 'hsl(var(--chart-4))',
	},
} satisfies ChartConfig;

export function ResponseTimeChart() {
	const { timeRange, setTimeRange, filterDataByTimeRange } = useTimeRange();
	const filteredData = filterDataByTimeRange(chartData);

	const averageResponseTime = Math.round(
		filteredData.reduce((acc, curr) => acc + curr.responseTime, 0) /
			filteredData.length
	);

	const minResponseTime = Math.min(
		...filteredData.map((d) => d.responseTime)
	);
	const maxResponseTime = Math.max(
		...filteredData.map((d) => d.responseTime)
	);

	return (
		<ChartCard
			title='Response Time'
			description='Average response time distribution'
			timeRange={timeRange}
			onTimeRangeChange={setTimeRange}
			footer={
				<div className='flex w-full flex-col items-start gap-2 text-sm'>
					<div className='flex items-center gap-2 font-medium leading-none'>
						{averageResponseTime}ms average response time{' '}
						<TrendingDown className='h-4 w-4' />
					</div>
					<div className='grid gap-1 leading-none text-muted-foreground'>
						<div>Min: {minResponseTime}ms</div>
						<div>Max: {maxResponseTime}ms</div>
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
						tickFormatter={(value) => `${value}ms`}
					/>
					<ChartTooltip
						cursor={false}
						content={
							<ChartTooltipContent labelFormatter={formatDate} />
						}
					/>
					<Bar
						dataKey='responseTime'
						fill='hsl(var(--chart-4))'
						radius={[4, 4, 0, 0]}
					/>
				</BarChart>
			</ChartContainer>
		</ChartCard>
	);
}
