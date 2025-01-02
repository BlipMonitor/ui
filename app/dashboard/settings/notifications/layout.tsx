import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Notification Settings | Soroban Monitor',
	description:
		'Configure your notification preferences for alerts and events',
};

interface NotificationsLayoutProps {
	children: React.ReactNode;
}

export default function NotificationsLayout({
	children,
}: NotificationsLayoutProps) {
	return <>{children}</>;
}
