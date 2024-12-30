import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Performance | Soroban Monitor',
	description:
		'Performance metrics and analytics for Soroban smart contracts',
};

export default function PerformancePage() {
	return (
		<div className='flex flex-1 flex-col gap-4 p-4'>
			<div className='rounded-xl bg-muted/50 p-4'>
				Performance Metrics Coming Soon
			</div>
		</div>
	);
}
