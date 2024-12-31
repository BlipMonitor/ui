'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
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

// Sample data - we'll replace this with real contract calls data later
const chartData = [
	{ date: '2024-12-01', success: 186, failure: 20 },
	{ date: '2024-12-02', success: 305, failure: 15 },
	{ date: '2024-12-03', success: 237, failure: 25 },
	{ date: '2024-12-04', success: 173, failure: 30 },
	{ date: '2024-12-05', success: 209, failure: 12 },
	{ date: '2024-12-06', success: 214, failure: 18 },
].map((d) => ({
	...d,
	total: d.success + d.failure,
	successRate: Math.round((d.success / (d.success + d.failure)) * 100),
}));

const chartConfig = {
	success: {
		label: 'Successful',
		color: 'hsl(var(--chart-1))',
	},
	failure: {
		label: 'Failed',
		color: 'hsl(var(--chart-2))',
	},
} satisfies ChartConfig;

export function SuccessRateChart() {
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

	const averageSuccessRate = Math.round(
		filteredData.reduce((acc, curr) => acc + curr.successRate, 0) /
			filteredData.length
	);

	return (
		<Card>
			<CardHeader className='flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row'>
				<div className='grid flex-1 gap-1 text-center sm:text-left'>
					<CardTitle>Success Rate</CardTitle>
					<CardDescription>
						Showing success vs failure ratio
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
						stackOffset='expand'
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
									indicator='dashed'
								/>
							}
						/>
						<Bar
							dataKey='success'
							fill='var(--color-success)'
							radius={[4, 4, 0, 0]}
							stackId='a'
						/>
						<Bar
							dataKey='failure'
							fill='var(--color-failure)'
							radius={[4, 4, 0, 0]}
							stackId='a'
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter>
				<div className='flex w-full items-start gap-2 text-sm'>
					<div className='grid gap-2'>
						<div className='flex items-center gap-2 font-medium leading-none'>
							Average success rate: {averageSuccessRate}%{' '}
							<TrendingUp className='h-4 w-4' />
						</div>
						<div className='flex items-center gap-2 leading-none text-muted-foreground'>
							Total transactions:{' '}
							{filteredData
								.reduce((acc, curr) => acc + curr.total, 0)
								.toLocaleString()}
						</div>
					</div>
				</div>
			</CardFooter>
		</Card>
	);
}
