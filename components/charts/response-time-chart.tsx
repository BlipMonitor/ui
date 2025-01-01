'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { format, subDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { TopCallsDialog } from '@/components/performance/top-calls-dialog';
import {
	ChartCard,
	TimeRange,
	filterDataByTimeRange,
	groupDataByDate,
} from './chart-utils';

// Utility function to calculate percentile
function percentile(arr: number[], p: number) {
	const sorted = [...arr].sort((a, b) => a - b);
	const pos = (sorted.length - 1) * (p / 100);
	const base = Math.floor(pos);
	const rest = pos - base;
	if (sorted[base + 1] !== undefined) {
		return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
	} else {
		return sorted[base];
	}
}

interface ResponseTime {
	id: string;
	timestamp: string;
	functionName: string;
	executionTime: number;
	transactionId: string;
	success: boolean;
}

// Sample data - we'll replace this with real response time data later
const sampleData: ResponseTime[] = Array.from({ length: 30 }, (_, i) => ({
	id: `call-${i}`,
	timestamp: subDays(new Date(), i).toISOString(),
	functionName: `transfer${i % 2 === 0 ? 'From' : 'To'}`,
	executionTime: Math.random() * 2 + 0.5,
	transactionId: `0x${Math.random().toString(16).slice(2)}`,
	success: Math.random() > 0.1,
}));

export function ResponseTimeChart() {
	const [timeRange, setTimeRange] = React.useState<TimeRange>('7d');
	const [showTopCalls, setShowTopCalls] = React.useState(false);

	// Group data by date and calculate averages
	const chartData = React.useMemo(() => {
		const filtered = filterDataByTimeRange(sampleData, timeRange);
		return groupDataByDate(filtered, (calls: ResponseTime[]) => ({
			average:
				calls.reduce((acc, call) => acc + call.executionTime, 0) /
				calls.length,
			p95: percentile(
				calls.map((call) => call.executionTime),
				95
			),
		}));
	}, [timeRange]);

	// Get top calls by execution time
	const topCalls = React.useMemo(() => {
		return sampleData
			.sort((a, b) => b.executionTime - a.executionTime)
			.slice(0, 20)
			.map((call) => ({
				id: call.id,
				timestamp: new Date(call.timestamp),
				function: call.functionName,
				value: call.executionTime,
				transactionId: call.transactionId,
			}));
	}, []);

	return (
		<ChartCard
			title='Response Time'
			description='Average and P95 response time for contract calls'
			timeRange={timeRange}
			onTimeRangeChange={setTimeRange}
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
			<div className='h-[350px] w-full'>
				<AreaChart
					data={chartData}
					margin={{
						left: 12,
						right: 12,
						top: 12,
						bottom: 12,
					}}
					width={800}
					height={350}
				>
					<defs>
						<linearGradient
							id='responseTimeGradient'
							x1='0'
							y1='0'
							x2='0'
							y2='1'
						>
							<stop
								offset='5%'
								stopColor='hsl(var(--primary))'
								stopOpacity={0.2}
							/>
							<stop
								offset='95%'
								stopColor='hsl(var(--primary))'
								stopOpacity={0}
							/>
						</linearGradient>
					</defs>
					<CartesianGrid
						strokeDasharray='3 3'
						className='stroke-muted'
					/>
					<XAxis
						dataKey='date'
						tickFormatter={(date) =>
							format(new Date(date), 'MMM d')
						}
						className='text-xs'
					/>
					<YAxis
						tickFormatter={(value) => `${value.toFixed(2)}s`}
						className='text-xs'
					/>
					<Area
						type='monotone'
						dataKey='average'
						stroke='hsl(var(--primary))'
						fill='url(#responseTimeGradient)'
						strokeWidth={2}
					/>
					<Area
						type='monotone'
						dataKey='p95'
						stroke='hsl(var(--destructive))'
						fill='none'
						strokeWidth={2}
						strokeDasharray='3 3'
					/>
				</AreaChart>
			</div>
			<TopCallsDialog
				open={showTopCalls}
				onOpenChange={setShowTopCalls}
				type='execution'
				data={topCalls}
			/>
		</ChartCard>
	);
}
