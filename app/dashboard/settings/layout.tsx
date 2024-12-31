import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Settings | Soroban Monitor',
	description:
		'Settings and configuration for Soroban smart contract monitoring',
};

interface SettingsLayoutProps {
	children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
	return <div className='flex flex-1 flex-col gap-4 p-4'>{children}</div>;
}
