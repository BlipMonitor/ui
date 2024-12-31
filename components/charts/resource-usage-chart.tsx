'use client';

import * as React from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { TrendingUp } from 'lucide-react';

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

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
	const [timeRange, setTimeRange] = React.useState('90d');

	const filteredData = chartData.filter((item) => {
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

	const getAverageUsage = (metric: 'cpu' | 'memory' | 'network') =>
		Math.round(
			filteredData.reduce((acc, curr) => acc + curr[metric], 0) /
				filteredData.length
		);

	return (
		<Card>
			<CardHeader className='flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row'>
				<div className='grid flex-1 gap-1 text-center sm:text-left'>
					<CardTitle>Resource Usage</CardTitle>
					<CardDescription>
						CPU, Memory, and Network utilization
					</CardDescription>
				</div>
				<Select
					value={timeRange}
					onValueChange={setTimeRange}
				>
					<SelectTrigger
						className='w-[160px] rounded-lg sm:ml-auto'
						aria-label='Select time range'
					>
						<SelectValue placeholder='Last 3 months' />
					</SelectTrigger>
					<SelectContent className='rounded-xl'>
						<SelectItem
							value='90d'
							className='rounded-lg'
						>
							Last 3 months
						</SelectItem>
						<SelectItem
							value='30d'
							className='rounded-lg'
						>
							Last 30 days
						</SelectItem>
						<SelectItem
							value='7d'
							className='rounded-lg'
						>
							Last 7 days
						</SelectItem>
					</SelectContent>
				</Select>
			</CardHeader>
			<CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
				<ChartContainer
					config={chartConfig}
					className='aspect-auto h-[250px] w-full'
				>
					<LineChart
						data={filteredData}
						margin={{
							left: 12,
							right: 12,
						}}
						accessibilityLayer
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey='date'
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={32}
							tickFormatter={(value) => {
								const date = new Date(value);
								return date.toLocaleDateString('en-US', {
									month: 'short',
									day: 'numeric',
								});
							}}
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tickFormatter={(value) => `${value}%`}
						/>
						<ChartTooltip
							cursor={false}
							content={
								<ChartTooltipContent
									labelFormatter={(value) => {
										return new Date(
											value
										).toLocaleDateString('en-US', {
											month: 'short',
											day: 'numeric',
										});
									}}
								/>
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
			</CardContent>
			<CardFooter>
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
			</CardFooter>
		</Card>
	);
}
