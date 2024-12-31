'use client';

import { ContractCallsChart } from '@/components/charts/contract-calls-chart';
import { SuccessRateChart } from '@/components/charts/success-rate-chart';

export default function PerformancePage() {
	return (
		<div className='grid gap-6 p-6 md:grid-cols-2'>
			<ContractCallsChart />
			<SuccessRateChart />
		</div>
	);
}
