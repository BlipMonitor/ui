import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Performance | Soroban Monitor',
	description:
		'Performance monitoring and analytics for Soroban smart contracts',
};

export default function PerformanceLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
