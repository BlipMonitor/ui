'use client';

import * as React from 'react';
import {
	Area,
	AreaChart,
	CartesianGrid,
	XAxis,
	YAxis,
	ResponsiveContainer,
	Tooltip as RechartsTooltip,
	TooltipProps,
} from 'recharts';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { TopCallsDialog } from '@/components/performance/top-calls-dialog';
import {
	ChartCard,
	TimeRange,
	filterDataByTimeRange,
	groupDataByDate,
} from './chart-utils';
import {
	generateMockPerformanceMetrics,
	type PerformanceMetric,
} from '@/lib/mock/performance';
import { HelpCircle } from 'lucide-react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

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

// Type for our modified mock data with string timestamps
interface MockMetric extends Omit<PerformanceMetric, 'timestamp'> {
	timestamp: string;
}

// Custom tooltip component
const CustomTooltip = ({
	active,
	payload,
	label,
}: TooltipProps<number, string>) => {
	if (
		active &&
		payload?.[0]?.value !== undefined &&
		payload?.[1]?.value !== undefined
	) {
		return (
			<div className='rounded-lg border bg-background p-2 shadow-sm'>
				<div className='grid grid-cols-2 gap-2'>
					<div className='flex flex-col'>
						<span className='text-[10px] uppercase text-muted-foreground'>
							Average
						</span>
						<span className='font-bold'>
							{payload[0].value.toFixed(2)}s
						</span>
					</div>
					<div className='flex flex-col'>
						<span className='text-[10px] uppercase text-muted-foreground'>
							P95
						</span>
						<span className='font-bold'>
							{payload[1].value.toFixed(2)}s
						</span>
					</div>
				</div>
				<div className='mt-1 text-xs text-muted-foreground'>
					{format(new Date(label), 'MMM d, yyyy')}
				</div>
			</div>
		);
	}
	return null;
};

export function ResponseTimeChart() {
	const [timeRange, setTimeRange] = React.useState<TimeRange>('7d');
	const [showTopCalls, setShowTopCalls] = React.useState(false);

	// Generate mock data for full 3 months
	const mockData = React.useMemo(() => {
		const count = 90 * 24; // 3 months of data points (24 per day)
		const metrics = generateMockPerformanceMetrics(count, {
			pattern: 'normal', // Use normal pattern for execution time
		});
		// Convert Date to string
		return metrics.map((metric) => ({
			...metric,
			timestamp: metric.timestamp.toISOString(),
		})) as MockMetric[];
	}, []); // No dependency on timeRange anymore since we always generate 3 months

	// Group data by date and calculate averages
	const chartData = React.useMemo(() => {
		const filtered = filterDataByTimeRange(mockData, timeRange);
		return groupDataByDate(filtered, (metrics: MockMetric[]) => {
			const executionTimes = metrics.map((m) => m.executionTime || 0);
			return {
				average:
					executionTimes.reduce((acc, time) => acc + time, 0) /
					executionTimes.length /
					1000, // Convert to seconds
				p95: percentile(executionTimes, 95) / 1000, // Convert to seconds
			};
		});
	}, [mockData, timeRange]);

	// Get top calls by execution time
	const topCalls = React.useMemo(() => {
		return mockData
			.sort((a, b) => (b.executionTime || 0) - (a.executionTime || 0))
			.slice(0, 20)
			.map((metric) => ({
				id: metric.transactionHash,
				timestamp: new Date(metric.timestamp),
				function: 'Contract Call',
				value: (metric.executionTime || 0) / 1000, // Convert to seconds
				transactionId: `${metric.transactionHash.slice(
					0,
					6
				)}...${metric.transactionHash.slice(-4)}`,
			}));
	}, [mockData]);

	return (
		<ChartCard
			title='Response Time'
			description={
				<div className='flex items-center gap-2'>
					Average and P95 response time for contract calls
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<HelpCircle className='h-4 w-4 text-muted-foreground' />
							</TooltipTrigger>
							<TooltipContent>
								<p className='max-w-xs'>
									<strong>Average:</strong> Mean execution
									time per contract call.
									<br />
									<strong>P95:</strong> 95th percentile - 95%
									of calls complete within this time.
									<br />
									Lower response times indicate better
									performance.
								</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			}
			timeRange={timeRange}
			onTimeRangeChange={setTimeRange}
			action={
				<Button
					variant='outline'
					size='sm'
					onClick={() => setShowTopCalls(true)}
				>
					View Top Calls by Time
				</Button>
			}
		>
			<div className='h-[350px] w-full'>
				<ResponsiveContainer
					width='100%'
					height='100%'
				>
					<AreaChart
						data={chartData}
						margin={{
							left: 12,
							right: 12,
							top: 12,
							bottom: 12,
						}}
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
						<RechartsTooltip content={<CustomTooltip />} />
					</AreaChart>
				</ResponsiveContainer>
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
