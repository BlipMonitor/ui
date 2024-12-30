import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Settings | Soroban Monitor',
	description:
		'Settings and configuration for Soroban smart contract monitoring',
};

export default function SettingsPage() {
	return (
		<div className='flex flex-1 flex-col gap-4 p-4'>
			<div className='rounded-xl bg-muted/50 p-4'>
				Settings Configuration Coming Soon
			</div>
		</div>
	);
}
