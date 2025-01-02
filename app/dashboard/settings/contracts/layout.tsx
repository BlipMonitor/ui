import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Contract Management | Soroban Monitor',
	description: 'Manage your Soroban smart contracts and their configurations',
};

interface ContractsLayoutProps {
	children: React.ReactNode;
}

export default function ContractsLayout({ children }: ContractsLayoutProps) {
	return <>{children}</>;
}
