'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { subDays } from 'date-fns';
import { type Alert } from '@/lib/mock/alerts';
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
	ChartCard,
	TimeRange,
} from './chart-utils';

const chartConfig = {
	total: {
		label: 'Total Alerts',
		color: 'hsl(var(--chart-1))',
	},
	critical: {
		label: 'Critical',
		color: 'hsl(var(--chart-3))',
	},
} satisfies ChartConfig;

interface AlertActivityChartProps {
	alerts: Alert[];
	timeRange: string;
	onTimeRangeChange: (value: string) => void;
}

export function AlertActivityChart({
	alerts,
	timeRange,
	onTimeRangeChange,
}: AlertActivityChartProps) {
	// Calculate chart data
	const chartData = React.useMemo(() => {
		const days = parseInt(timeRange);
		const endDate = new Date();

		// Create an array of all dates in the range
		const dates = Array.from({ length: days })
			.map((_, i) => {
				const date = subDays(endDate, i);
				return {
					date,
					total: 0,
					critical: 0,
				};
			})
			.reverse();

		// Count alerts for each date
		alerts.forEach((alert) => {
			const alertDate = alert.triggeredAt;
			const datePoint = dates.find(
				(d) => d.date.toDateString() === alertDate.toDateString()
			);
			if (datePoint) {
				datePoint.total++;
				if (alert.severity === 'critical') {
					datePoint.critical++;
				}
			}
		});

		return dates;
	}, [alerts, timeRange]);

	const totalAlerts = chartData.reduce((acc, curr) => acc + curr.total, 0);
	const averageAlerts = Math.round(totalAlerts / chartData.length);
	const criticalAlerts = chartData.reduce(
		(acc, curr) => acc + curr.critical,
		0
	);

	return (
		<div className='col-span-4'>
			<ChartCard
				title='Alert Activity'
				description='Alert frequency over time'
				timeRange={timeRange as TimeRange}
				onTimeRangeChange={onTimeRangeChange}
				footer={
					<div className='flex w-full flex-col items-start gap-2 text-sm'>
						<div className='flex items-center gap-2 font-medium leading-none'>
							{averageAlerts} avg. alerts per day{' '}
							<TrendingUp className='h-4 w-4' />
						</div>
						<div className='text-muted-foreground'>
							{totalAlerts} total alerts ({criticalAlerts}{' '}
							critical) in selected period
						</div>
					</div>
				}
			>
				<ChartContainer
					config={chartConfig}
					className={chartContainerClass}
				>
					<AreaChart
						data={chartData}
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
							<linearGradient
								id='critical'
								x1='0'
								y1='0'
								x2='0'
								y2='1'
							>
								<stop
									offset='0%'
									stopColor='hsl(var(--chart-3))'
									stopOpacity={0.2}
								/>
								<stop
									offset='100%'
									stopColor='hsl(var(--chart-3))'
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
								<ChartTooltipContent
									labelFormatter={formatDate}
								/>
							}
						/>
						<Area
							type='natural'
							dataKey='total'
							stroke='hsl(var(--chart-1))'
							strokeWidth={2}
							fill='url(#total)'
						/>
						<Area
							type='natural'
							dataKey='critical'
							stroke='hsl(var(--chart-3))'
							strokeWidth={2}
							fill='url(#critical)'
						/>
					</AreaChart>
				</ChartContainer>
			</ChartCard>
		</div>
	);
}
