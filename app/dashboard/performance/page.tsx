'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
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

// Sample data - we'll replace this with real contract calls data later
const chartData = [
	{ date: '2024-12-01', successful: 222, failed: 150 },
	{ date: '2024-12-02', successful: 97, failed: 80 },
	{ date: '2024-12-03', successful: 167, failed: 120 },
	// ... more data points
].map((d) => ({
	...d,
	total: d.successful + d.failed,
}));

const chartConfig = {
	calls: {
		label: 'Contract Calls',
	},
	successful: {
		label: 'Successful',
		color: 'hsl(var(--chart-1))',
	},
	failed: {
		label: 'Failed',
		color: 'hsl(var(--chart-2))',
	},
} satisfies ChartConfig;

export default function PerformancePage() {
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

	return (
		<div className='grid gap-6 p-6'>
			<Card>
				<CardHeader className='flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row'>
					<div className='grid flex-1 gap-1 text-center sm:text-left'>
						<CardTitle>Contract Calls</CardTitle>
						<CardDescription>
							Showing contract call volume over time
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
						<AreaChart data={filteredData}>
							<defs>
								<linearGradient
									id='fillSuccessful'
									x1='0'
									y1='0'
									x2='0'
									y2='1'
								>
									<stop
										offset='5%'
										stopColor='var(--color-successful)'
										stopOpacity={0.8}
									/>
									<stop
										offset='95%'
										stopColor='var(--color-successful)'
										stopOpacity={0.1}
									/>
								</linearGradient>
								<linearGradient
									id='fillFailed'
									x1='0'
									y1='0'
									x2='0'
									y2='1'
								>
									<stop
										offset='5%'
										stopColor='var(--color-failed)'
										stopOpacity={0.8}
									/>
									<stop
										offset='95%'
										stopColor='var(--color-failed)'
										stopOpacity={0.1}
									/>
								</linearGradient>
							</defs>
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
										indicator='dot'
									/>
								}
							/>
							<Area
								dataKey='failed'
								type='natural'
								fill='url(#fillFailed)'
								stroke='var(--color-failed)'
								stackId='a'
							/>
							<Area
								dataKey='successful'
								type='natural'
								fill='url(#fillSuccessful)'
								stroke='var(--color-successful)'
								stackId='a'
							/>
							<ChartLegend content={<ChartLegendContent />} />
						</AreaChart>
					</ChartContainer>
				</CardContent>
				<CardFooter>
					<div className='flex w-full items-start gap-2 text-sm'>
						<div className='grid gap-2'>
							<div className='flex items-center gap-2 font-medium leading-none'>
								Contract calls up by 12.5% this month{' '}
								<TrendingUp className='h-4 w-4' />
							</div>
							<div className='flex items-center gap-2 leading-none text-muted-foreground'>
								Total calls:{' '}
								{filteredData
									.reduce((acc, curr) => acc + curr.total, 0)
									.toLocaleString()}
							</div>
						</div>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
