'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { TrendingDown } from 'lucide-react';

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

// Sample data - we'll replace this with real response time data later
const chartData = [
	{ date: '2024-12-01', avg: 186, min: 150, max: 220 },
	{ date: '2024-12-02', avg: 305, min: 280, max: 350 },
	{ date: '2024-12-03', avg: 237, min: 200, max: 280 },
	{ date: '2024-12-04', avg: 173, min: 150, max: 190 },
	{ date: '2024-12-05', avg: 209, min: 180, max: 240 },
	{ date: '2024-12-06', avg: 214, min: 190, max: 250 },
].map((d) => ({
	...d,
	range: `${d.min}ms - ${d.max}ms`,
}));

const chartConfig = {
	responseTime: {
		label: 'Response Time',
	},
	avg: {
		label: 'Average (ms)',
		color: 'hsl(var(--chart-3))',
	},
} satisfies ChartConfig;

export function ResponseTimeChart() {
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

	const averageResponseTime = Math.round(
		filteredData.reduce((acc, curr) => acc + curr.avg, 0) /
			filteredData.length
	);

	const minResponseTime = Math.min(...filteredData.map((d) => d.min));
	const maxResponseTime = Math.max(...filteredData.map((d) => d.max));

	return (
		<Card>
			<CardHeader className='flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row'>
				<div className='grid flex-1 gap-1 text-center sm:text-left'>
					<CardTitle>Response Time</CardTitle>
					<CardDescription>
						Average response time in milliseconds
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
					<BarChart
						data={filteredData}
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
							tickFormatter={(value) => `${value}ms`}
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
									indicator='line'
								/>
							}
						/>
						<Bar
							dataKey='avg'
							fill='var(--color-avg)'
							radius={8}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter>
				<div className='flex w-full flex-col items-start gap-2 text-sm'>
					<div className='flex items-center gap-2 font-medium leading-none'>
						Response time improved by 12ms{' '}
						<TrendingDown className='h-4 w-4 text-green-500' />
					</div>
					<div className='grid gap-1 leading-none text-muted-foreground'>
						<div>Average: {averageResponseTime}ms</div>
						<div>
							Range: {minResponseTime}ms - {maxResponseTime}ms
						</div>
					</div>
				</div>
			</CardFooter>
		</Card>
	);
}
