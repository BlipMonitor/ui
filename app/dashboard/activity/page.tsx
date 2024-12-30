import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Activity | Soroban Monitor',
	description:
		'Activity feed and transaction logs for Soroban smart contracts',
};

export default function ActivityPage() {
	return (
		<div className='flex flex-1 flex-col gap-4 p-4'>
			<div className='rounded-xl bg-muted/50 p-4'>
				Activity Feed Coming Soon
			</div>
		</div>
	);
}
