'use client';

import * as React from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { TrendingUp } from 'lucide-react';

import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
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

// Sample data - we'll replace this with real resource usage data later
const chartData = [
	{ date: '2024-12-01', cpu: 45, memory: 60, network: 30 },
	{ date: '2024-12-02', cpu: 55, memory: 65, network: 40 },
	{ date: '2024-12-03', cpu: 65, memory: 70, network: 35 },
	{ date: '2024-12-04', cpu: 50, memory: 75, network: 45 },
	{ date: '2024-12-05', cpu: 60, memory: 80, network: 50 },
	{ date: '2024-12-06', cpu: 70, memory: 85, network: 55 },
];

const chartConfig = {
	resources: {
		label: 'Resource Usage',
	},
	cpu: {
		label: 'CPU (%)',
		color: 'hsl(var(--chart-3))',
	},
	memory: {
		label: 'Memory (%)',
		color: 'hsl(var(--chart-4))',
	},
	network: {
		label: 'Network (MB/s)',
		color: 'hsl(var(--chart-5))',
	},
} satisfies ChartConfig;

export function ResourceUsageChart() {
	const { timeRange, setTimeRange, filterDataByTimeRange } = useTimeRange();
	const filteredData = filterDataByTimeRange(chartData);

	const getAverageUsage = (metric: 'cpu' | 'memory' | 'network') =>
		Math.round(
			filteredData.reduce((acc, curr) => acc + curr[metric], 0) /
				filteredData.length
		);

	return (
		<ChartCard
			title='Resource Usage'
			description='CPU, Memory, and Network utilization'
			timeRange={timeRange}
			onTimeRangeChange={setTimeRange}
			footer={
				<div className='flex w-full flex-col items-start gap-2 text-sm'>
					<div className='flex items-center gap-2 font-medium leading-none'>
						Resource usage trending up{' '}
						<TrendingUp className='h-4 w-4' />
					</div>
					<div className='grid gap-1 leading-none text-muted-foreground'>
						<div>CPU: avg {getAverageUsage('cpu')}%</div>
						<div>Memory: avg {getAverageUsage('memory')}%</div>
						<div>
							Network: avg {getAverageUsage('network')} MB/s
						</div>
					</div>
				</div>
			}
		>
			<ChartContainer
				config={chartConfig}
				className={chartContainerClass}
			>
				<LineChart
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
						tickFormatter={(value) => `${value}%`}
					/>
					<ChartTooltip
						cursor={false}
						content={
							<ChartTooltipContent labelFormatter={formatDate} />
						}
					/>
					<Line
						type='natural'
						dataKey='cpu'
						stroke='var(--color-cpu)'
						strokeWidth={2}
						dot={false}
					/>
					<Line
						type='natural'
						dataKey='memory'
						stroke='var(--color-memory)'
						strokeWidth={2}
						dot={false}
					/>
					<Line
						type='natural'
						dataKey='network'
						stroke='var(--color-network)'
						strokeWidth={2}
						dot={false}
					/>
					<ChartLegend content={<ChartLegendContent />} />
				</LineChart>
			</ChartContainer>
		</ChartCard>
	);
}
