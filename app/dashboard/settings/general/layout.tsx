import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'General Settings | Soroban Monitor',
	description:
		'Configure general settings and preferences for your dashboard',
};

interface GeneralLayoutProps {
	children: React.ReactNode;
}

export default function GeneralLayout({ children }: GeneralLayoutProps) {
	return <>{children}</>;
}
