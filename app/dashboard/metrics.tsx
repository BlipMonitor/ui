'use client';

import { MetricCard } from '@/components/metrics/metric-card';
import { Activity, AlertTriangle, BarChart3, CheckCircle2 } from 'lucide-react';
import { generateMockAnomalies } from '@/lib/mock/anomalies';
import { generateMockEvents } from '@/lib/mock/events';
import { generateMockPerformanceMetrics } from '@/lib/mock/performance';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function Metrics() {
	const [isLoading, setIsLoading] = useState(true);
	const [metrics, setMetrics] = useState({
		successRate: 0,
		failures: 0,
		avgGasUsage: 0,
		activeAnomalies: 0,
	});

	useEffect(() => {
		const fetchData = async () => {
			// Generate mock data for the last 24 hours
			const end = new Date();
			const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
			const timeRange = { start, end };

			// Generate events for success rate and failures
			const events = generateMockEvents(100, { timeRange });
			const successRate =
				(events.filter((e) => e.status === 'success').length /
					events.length) *
				100;
			const failures = events.filter(
				(e) => e.status === 'failure'
			).length;

			// Generate performance metrics for gas usage
			const performanceMetrics = generateMockPerformanceMetrics(50, {
				timeRange,
			});
			const avgGasUsage = Math.round(
				performanceMetrics.reduce(
					(sum, metric) => sum + metric.gasUsed,
					0
				) / performanceMetrics.length
			);

			// Generate anomalies
			const mockAnomalies = generateMockAnomalies(20);
			const activeAnomalies = mockAnomalies.filter(
				(a) => a.status === 'active'
			).length;

			setMetrics({
				successRate: Number(successRate.toFixed(1)),
				failures,
				avgGasUsage: Math.round(avgGasUsage / 1000), // Convert to K
				activeAnomalies,
			});
			setIsLoading(false);
		};

		fetchData();
	}, []);

	if (isLoading) {
		return (
			<>
				<div className='p-6 bg-card rounded-lg border'>
					<div className='space-y-2'>
						<Skeleton className='h-4 w-[100px]' />
						<Skeleton className='h-8 w-[60px]' />
						<div className='flex items-center gap-2'>
							<Skeleton className='h-4 w-4' />
							<Skeleton className='h-4 w-[80px]' />
						</div>
					</div>
				</div>
				<div className='p-6 bg-card rounded-lg border'>
					<div className='space-y-2'>
						<Skeleton className='h-4 w-[100px]' />
						<Skeleton className='h-8 w-[60px]' />
						<div className='flex items-center gap-2'>
							<Skeleton className='h-4 w-4' />
							<Skeleton className='h-4 w-[80px]' />
						</div>
					</div>
				</div>
				<div className='p-6 bg-card rounded-lg border'>
					<div className='space-y-2'>
						<Skeleton className='h-4 w-[100px]' />
						<Skeleton className='h-8 w-[60px]' />
						<div className='flex items-center gap-2'>
							<Skeleton className='h-4 w-4' />
							<Skeleton className='h-4 w-[80px]' />
						</div>
					</div>
				</div>
				<div className='p-6 bg-card rounded-lg border'>
					<div className='space-y-2'>
						<Skeleton className='h-4 w-[100px]' />
						<Skeleton className='h-8 w-[60px]' />
						<div className='flex items-center gap-2'>
							<Skeleton className='h-4 w-4' />
							<Skeleton className='h-4 w-[80px]' />
						</div>
					</div>
				</div>
			</>
		);
	}

	return (
		<>
			<MetricCard
				title='Success Rate'
				value={`${metrics.successRate}%`}
				icon={CheckCircle2}
				trend={{ value: 2.1, isPositive: true }}
				description='Last 24 hours'
				href='/dashboard/performance'
			/>
			<MetricCard
				title='Failures'
				value={metrics.failures.toString()}
				icon={AlertTriangle}
				trend={{ value: 4.5, isPositive: false }}
				description='Last 24 hours'
				href='/dashboard/activity'
			/>
			<MetricCard
				title='Average Gas Usage'
				value={`${metrics.avgGasUsage}K`}
				icon={BarChart3}
				trend={{ value: -1.8, isPositive: true }}
				description='Last 24 hours'
				href='/dashboard/performance'
			/>
			<MetricCard
				title='Active Anomalies'
				value={metrics.activeAnomalies.toString()}
				icon={Activity}
				trend={{ value: 100, isPositive: false }}
				description='Last 24 hours'
				href='/dashboard/anomalies'
			/>
		</>
	);
}
