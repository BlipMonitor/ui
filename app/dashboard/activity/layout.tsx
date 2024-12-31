import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Activity | Soroban Monitor',
	description:
		'Activity feed and transaction logs for Soroban smart contracts',
};

export default function ActivityLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
