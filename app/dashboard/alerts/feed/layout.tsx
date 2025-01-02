import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Recent Alerts | Soroban Monitor',
	description: 'View and manage recent alerts for Soroban smart contracts',
};

export default function RecentAlertsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
