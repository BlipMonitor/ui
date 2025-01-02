import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Alerts | Soroban Monitor',
	description: 'Monitor and manage alerts for your Soroban smart contracts.',
};

export default function AlertsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
