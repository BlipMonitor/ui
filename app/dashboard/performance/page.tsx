'use client';

import { Suspense } from 'react';
import { ChartSkeleton } from '@/components/charts/chart-skeleton';
import { ContractCallsChart } from '@/components/charts/contract-calls-chart';
import { ResourceUsageChart } from '@/components/charts/resource-usage-chart';
import { ResponseTimeChart } from '@/components/charts/response-time-chart';
import { SuccessRateChart } from '@/components/charts/success-rate-chart';

export default function PerformancePage() {
	return (
		<div className='flex flex-1 flex-col p-4'>
			<div className='grid gap-4 sm:grid-cols-2'>
				<Suspense fallback={<ChartSkeleton />}>
					<ContractCallsChart />
				</Suspense>
				<Suspense fallback={<ChartSkeleton />}>
					<SuccessRateChart />
				</Suspense>
				<Suspense fallback={<ChartSkeleton />}>
					<ResponseTimeChart />
				</Suspense>
				<Suspense fallback={<ChartSkeleton />}>
					<ResourceUsageChart />
				</Suspense>
			</div>
		</div>
	);
}
