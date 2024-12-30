import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Alerts | Soroban Monitor',
	description:
		'Alert configuration and monitoring for Soroban smart contracts',
};

export default function AlertsPage() {
	return (
		<div className='flex flex-1 flex-col gap-4 p-4'>
			<div className='rounded-xl bg-muted/50 p-4'>
				Alerts Configuration Coming Soon
			</div>
		</div>
	);
}
