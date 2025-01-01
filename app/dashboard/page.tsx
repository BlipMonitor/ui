import { Metadata } from 'next';
import { Suspense } from 'react';
import { Metrics } from './metrics';
import { MetricGrid } from '@/components/metrics/metric-grid';
import { MetricCardSkeleton } from '@/components/metrics/metric-card-skeleton';
import { ActiveAlertsBanner } from '@/components/alerts/active-alerts-banner';
import { RecentEvents } from '@/components/recent-events/recent-events';
import { RecentEventsSkeleton } from '@/components/recent-events/recent-events-skeleton';
import { MiniGasChart } from '@/components/charts/mini-gas-chart';
import { MiniGasChartSkeleton } from '@/components/charts/mini-gas-chart-skeleton';

export const metadata: Metadata = {
	title: 'Overview | Soroban Monitor',
	description:
		'Monitor your Soroban smart contracts with real-time metrics and alerts',
};

export default function DashboardPage() {
	// TODO: Replace with real data from API
	const activeAlertsCount = 2;

	return (
		<div className='flex flex-1 flex-col gap-4 p-4'>
			<div className='flex items-center justify-between'>
				<h1 className='text-lg font-medium'>Overview</h1>
			</div>
			<ActiveAlertsBanner count={activeAlertsCount} />
			<MetricGrid>
				<Suspense
					fallback={
						<>
							<MetricCardSkeleton />
							<MetricCardSkeleton />
							<MetricCardSkeleton />
							<MetricCardSkeleton />
						</>
					}
				>
					<Metrics />
				</Suspense>
			</MetricGrid>
			<div className='grid gap-4 md:grid-cols-2'>
				<Suspense fallback={<MiniGasChartSkeleton />}>
					<MiniGasChart />
				</Suspense>
				<Suspense fallback={<RecentEventsSkeleton />}>
					<RecentEvents />
				</Suspense>
			</div>
		</div>
	);
}
