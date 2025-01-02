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
	ChartCard,
	groupDataByDate,
	filterDataByTimeRange,
	TimeRange,
} from './chart-utils';
import { Button } from '@/components/ui/button';
import { TopCallsDialog } from '@/components/performance/top-calls-dialog';
import { generateMockEvents, type ContractEvent } from '@/lib/mock/events';

interface ContractCall {
	id: string;
	timestamp: string;
	functionName: string;
	gasUsed: number;
	transactionId: string;
	success: boolean;
}

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

// Convert ContractEvent to ContractCall
function convertToContractCall(event: ContractEvent): ContractCall {
	return {
		id: event.id,
		timestamp: event.timestamp.toISOString(),
		functionName: event.functionName || event.type,
		gasUsed: event.gasUsed || 0,
		transactionId: event.transactionHash,
		success: event.status === 'success',
	};
}

export function ContractCallsChart() {
	const [timeRange, setTimeRange] = React.useState<TimeRange>('7d');
	const [showTopCalls, setShowTopCalls] = React.useState(false);

	// Generate mock data
	const mockData = React.useMemo(() => {
		const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 1;
		const count = days * 24; // 24 events per day for realistic data
		return generateMockEvents(count).map(convertToContractCall);
	}, [timeRange]);

	// Group data by date and calculate totals
	const chartData = React.useMemo(() => {
		const filtered = filterDataByTimeRange(mockData, timeRange);
		return groupDataByDate(filtered, (calls) => ({
			total: calls.length,
			success: calls.filter((call) => call.success).length,
			failed: calls.filter((call) => !call.success).length,
		}));
	}, [mockData, timeRange]);

	// Get top calls by gas usage
	const topCalls = React.useMemo(() => {
		return mockData
			.sort((a, b) => b.gasUsed - a.gasUsed)
			.slice(0, 20)
			.map((call) => ({
				id: call.id,
				timestamp: new Date(call.timestamp),
				function: call.functionName,
				value: call.gasUsed,
				transactionId: call.transactionId,
			}));
	}, [mockData]);

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
