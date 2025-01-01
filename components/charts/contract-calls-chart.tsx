'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { subDays } from 'date-fns';

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
	groupDataByDate,
	filterDataByTimeRange,
	TimeRange,
} from './chart-utils';
import { Button } from '@/components/ui/button';
import { TopCallsDialog } from '@/components/performance/top-calls-dialog';

interface ContractCall {
	id: string;
	timestamp: string;
	functionName: string;
	gasUsed: number;
	transactionId: string;
	success: boolean;
}

// Sample data - we'll replace this with real contract calls data later
const sampleData: ContractCall[] = Array.from({ length: 30 }, (_, i) => ({
	id: `call-${i}`,
	timestamp: subDays(new Date(), i).toISOString(),
	functionName: `transfer${i % 2 === 0 ? 'From' : 'To'}`,
	gasUsed: Math.floor(Math.random() * 5000000) + 1000000,
	transactionId: `0x${Math.random().toString(16).slice(2)}`,
	success: Math.random() > 0.1,
}));

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
	const [timeRange, setTimeRange] = React.useState<TimeRange>('7d');
	const [showTopCalls, setShowTopCalls] = React.useState(false);

	// Group data by date and calculate totals
	const chartData = React.useMemo(() => {
		const filtered = filterDataByTimeRange(sampleData, timeRange);
		return groupDataByDate(filtered, (calls) => ({
			total: calls.length,
			success: calls.filter((call) => call.success).length,
			failed: calls.filter((call) => !call.success).length,
		}));
	}, [timeRange]);

	// Get top calls by gas usage
	const topCalls = React.useMemo(() => {
		return sampleData
			.sort((a, b) => b.gasUsed - a.gasUsed)
			.slice(0, 20)
			.map((call) => ({
				id: call.id,
				timestamp: new Date(call.timestamp),
				function: call.functionName,
				value: call.gasUsed,
				transactionId: call.transactionId,
			}));
	}, []);

	const totalCalls = chartData.reduce((acc, curr) => acc + curr.total, 0);
	const averageCalls = Math.round(totalCalls / chartData.length);

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
			action={
				<Button
					variant='outline'
					size='sm'
					onClick={() => setShowTopCalls(true)}
				>
					View Top Calls
				</Button>
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
			<TopCallsDialog
				open={showTopCalls}
				onOpenChange={setShowTopCalls}
				type='gas'
				data={topCalls}
			/>
		</ChartCard>
	);
}
