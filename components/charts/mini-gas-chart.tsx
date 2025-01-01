'use client';

import * as React from 'react';
import {
	Area,
	AreaChart,
	CartesianGrid,
	XAxis,
	YAxis,
	ReferenceLine,
} from 'recharts';
import Link from 'next/link';
import { TrendingDown } from 'lucide-react';
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
} from '@/components/ui/chart';
import {
	chartContainerClass,
	commonAxisConfig,
	commonGridConfig,
	formatDate,
	ChartCard,
	useTimeRange,
	TimeRange,
} from './chart-utils';

interface GasData {
	date: string;
	gasUsage: number;
}

// Sample data - we'll replace this with real gas usage data later
const chartData: GasData[] = [
	{ date: '2024-12-20', gasUsage: 1200000 },
	{ date: '2024-12-21', gasUsage: 1150000 },
	{ date: '2024-12-22', gasUsage: 1300000 },
	{ date: '2024-12-23', gasUsage: 1250000 },
	{ date: '2024-12-24', gasUsage: 1180000 },
	{ date: '2024-12-25', gasUsage: 1220000 },
	{ date: '2024-12-26', gasUsage: 1190000 },
];

const chartConfig = {
	gasUsage: {
		label: 'Gas Usage',
		color: 'hsl(var(--chart-1))',
	},
} satisfies ChartConfig;

// Calculate threshold as 20% above average
const calculateThreshold = (data: GasData[]) => {
	const average =
		data.reduce((acc, curr) => acc + curr.gasUsage, 0) / data.length;
	return average * 1.2;
};

export function MiniGasChart() {
	const { timeRange, setTimeRange, filterDataByTimeRange } = useTimeRange();
	const filteredData = filterDataByTimeRange(chartData);
	const averageGasUsage = Math.round(
		filteredData.reduce((acc, curr) => acc + curr.gasUsage, 0) /
			filteredData.length
	);
	const threshold = calculateThreshold(filteredData);

	return (
		<Link
			href='/dashboard/performance'
			className='block'
		>
			<ChartCard
				title='Gas Usage'
				description='Contract gas consumption over time'
				timeRange={timeRange}
				onTimeRangeChange={(value: TimeRange) => setTimeRange(value)}
				footer={
					<div className='flex w-full flex-col items-start gap-2 text-sm'>
						<div className='flex items-center gap-2 font-medium leading-none'>
							{(averageGasUsage / 1000000).toFixed(1)}M average
							gas <TrendingDown className='h-4 w-4' />
						</div>
						<div className='text-muted-foreground'>
							{
								filteredData.filter(
									(d) => d.gasUsage > threshold
								).length
							}{' '}
							spikes detected in selected period
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
								id='gasUsage'
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
							tickFormatter={(value) =>
								`${(value / 1000000).toFixed(1)}M`
							}
						/>
						<ReferenceLine
							y={threshold}
							stroke='hsl(var(--warning))'
							strokeDasharray='3 3'
							strokeOpacity={0.5}
							label={{
								value: 'Threshold',
								position: 'right',
								fill: 'hsl(var(--warning))',
								fontSize: 12,
							}}
						/>
						<ChartTooltip
							cursor={{
								stroke: 'hsl(var(--muted-foreground))',
								strokeWidth: 1,
								strokeDasharray: '4 4',
							}}
							content={({ label, payload }) => {
								if (!payload?.length) return null;
								const value = payload[0].value as number;
								const percentageOfAverage = (
									(value / averageGasUsage) * 100 -
									100
								).toFixed(1);
								const isHighUsage = value > threshold;

								return (
									<div className='rounded-lg border border-border/50 bg-background px-3 py-2 text-sm shadow-xl'>
										<div className='font-medium'>
											{formatDate(label)}
										</div>
										<div className='mt-1.5 grid gap-1.5'>
											<div className='flex items-center justify-between gap-2'>
												<span className='text-muted-foreground'>
													Gas Usage:
												</span>
												<span
													className={
														isHighUsage
															? 'text-warning'
															: ''
													}
												>
													{(value / 1000000).toFixed(
														1
													)}
													M
												</span>
											</div>
											<div className='flex items-center justify-between gap-2'>
												<span className='text-muted-foreground'>
													vs Average:
												</span>
												<span
													className={
														Number(
															percentageOfAverage
														) > 0
															? 'text-warning'
															: ''
													}
												>
													{percentageOfAverage}%
												</span>
											</div>
											<div className='flex items-center justify-between gap-2'>
												<span className='text-muted-foreground'>
													Status:
												</span>
												<span
													className={
														isHighUsage
															? 'text-warning'
															: ''
													}
												>
													{isHighUsage
														? '⚠️ High Usage'
														: 'Normal Usage'}
												</span>
											</div>
										</div>
									</div>
								);
							}}
						/>
						<Area
							type='natural'
							dataKey='gasUsage'
							stroke='hsl(var(--chart-1))'
							strokeWidth={2}
							fill='url(#gasUsage)'
							isAnimationActive={false}
							activeDot={({ cx, cy, payload }) => {
								const isHighUsage =
									payload.gasUsage > threshold;
								return (
									<circle
										cx={cx}
										cy={cy}
										r={4}
										fill={
											isHighUsage
												? 'hsl(var(--warning))'
												: 'hsl(var(--chart-1))'
										}
										stroke='var(--background)'
										strokeWidth={2}
									/>
								);
							}}
							dot={({ cx, cy, payload }) => {
								if (!payload || payload.gasUsage <= threshold)
									return null;
								return (
									<circle
										cx={cx}
										cy={cy}
										r={4}
										fill='hsl(var(--warning))'
										stroke='var(--background)'
										strokeWidth={2}
									/>
								);
							}}
						/>
					</AreaChart>
				</ChartContainer>
			</ChartCard>
		</Link>
	);
}
