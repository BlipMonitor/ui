'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
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

// Sample data - we'll replace this with real contract calls data later
const chartData = [
	{ date: '2024-12-01', total: 234, success: 200, failed: 34 },
	{ date: '2024-12-02', total: 278, success: 240, failed: 38 },
	{ date: '2024-12-03', total: 189, success: 170, failed: 19 },
	{ date: '2024-12-04', total: 289, success: 250, failed: 39 },
	{ date: '2024-12-05', total: 349, success: 300, failed: 49 },
	{ date: '2024-12-06', total: 289, success: 250, failed: 39 },
];

const chartConfig = {
	total: {
		label: 'Total Calls',
		color: 'hsl(var(--chart-1))',
	},
	success: {
		label: 'Successful',
		color: 'hsl(var(--chart-2))',
	},
	failed: {
		label: 'Failed',
		color: 'hsl(var(--chart-3))',
	},
} satisfies ChartConfig;

export function ContractCallsChart() {
	const { timeRange, setTimeRange, filterDataByTimeRange } = useTimeRange();
	const filteredData = filterDataByTimeRange(chartData);

	const totalCalls = filteredData.reduce((acc, curr) => acc + curr.total, 0);
	const averageCalls = Math.round(totalCalls / filteredData.length);

	return (
		<ChartCard
			title='Contract Calls'
			description='Total contract calls over time'
			timeRange={timeRange}
			onTimeRangeChange={setTimeRange}
			footer={
				<div className='flex w-full flex-col items-start gap-2 text-sm'>
					<div className='flex items-center gap-2 font-medium leading-none'>
						{averageCalls} avg. calls per day{' '}
						<TrendingUp className='h-4 w-4' />
					</div>
					<div className='text-muted-foreground'>
						{totalCalls} total calls in selected period
					</div>
				</div>
			}
		>
			<ChartContainer
				config={chartConfig}
				className={chartContainerClass}
			>
				<AreaChart
					data={filteredData}
					margin={{
						left: 12,
						right: 12,
					}}
					accessibilityLayer
				>
					<defs>
						<linearGradient
							id='total'
							x1='0'
							y1='0'
							x2='0'
							y2='1'
						>
							<stop
								offset='0%'
								stopColor='hsl(var(--chart-1))'
								stopOpacity={0.2}
							/>
							<stop
								offset='100%'
								stopColor='hsl(var(--chart-1))'
								stopOpacity={0}
							/>
						</linearGradient>
					</defs>
					<CartesianGrid {...commonGridConfig} />
					<XAxis
						{...commonAxisConfig}
						dataKey='date'
						minTickGap={32}
						tickFormatter={formatDate}
					/>
					<YAxis
						{...commonAxisConfig}
						tickFormatter={(value) => `${value}`}
					/>
					<ChartTooltip
						cursor={false}
						content={
							<ChartTooltipContent labelFormatter={formatDate} />
						}
					/>
					<Area
						type='natural'
						dataKey='total'
						stroke='hsl(var(--chart-1))'
						strokeWidth={2}
						fill='url(#total)'
					/>
				</AreaChart>
			</ChartContainer>
		</ChartCard>
	);
}
