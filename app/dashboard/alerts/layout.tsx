import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Alerts | Soroban Monitor',
	description: 'View and manage alerts for Soroban smart contracts',
};

export default function AlertsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
