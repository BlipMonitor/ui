'use client';

import { Suspense } from 'react';
import { ChartSkeleton } from '@/components/charts/chart-skeleton';
import { ResponseTimeChart } from '@/components/charts/response-time-chart';
import { GasUsageChart } from '@/components/charts/gas-usage-chart';
import { MemoryUsageChart } from '@/components/charts/memory-usage-chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PerformancePage() {
	return (
		<div className='flex flex-1 flex-col p-4'>
			<Tabs
				defaultValue='gas'
				className='w-full'
			>
				<TabsList className='mb-4'>
					<TabsTrigger value='gas'>Gas Usage</TabsTrigger>
					<TabsTrigger value='execution'>Execution Time</TabsTrigger>
				</TabsList>
				<TabsContent value='gas'>
					<div className='grid gap-4 sm:grid-cols-2'>
						<Suspense fallback={<ChartSkeleton />}>
							<GasUsageChart />
						</Suspense>
						<Suspense fallback={<ChartSkeleton />}>
							<MemoryUsageChart />
						</Suspense>
					</div>
				</TabsContent>
				<TabsContent value='execution'>
					<div className='grid gap-4 sm:grid-cols-2'>
						<Suspense fallback={<ChartSkeleton />}>
							<ResponseTimeChart />
						</Suspense>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
