import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Account Settings | Soroban Monitor',
	description:
		'Manage your account settings, profile information, and password',
};

interface AccountLayoutProps {
	children: React.ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps) {
	return <>{children}</>;
}
