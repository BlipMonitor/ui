'use client';

import { ContractCallsChart } from '@/components/charts/contract-calls-chart';

export default function PerformancePage() {
	return (
		<div className='grid gap-6 p-6'>
			<ContractCallsChart />
		</div>
	);
}
