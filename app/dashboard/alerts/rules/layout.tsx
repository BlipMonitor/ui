import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Alert Rules | Soroban Monitor',
	description: 'Manage alert rules for Soroban smart contracts',
};

export default function AlertRulesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
