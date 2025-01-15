import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Anomalies | Soroban Monitor',
	description:
		'View and manage auto-detected anomalies in your Soroban smart contracts',
};

export default function AnomaliesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
