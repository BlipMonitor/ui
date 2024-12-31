'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useHotkeys } from 'react-hotkeys-hook';
import {
	Settings2,
	LayoutDashboard,
	Activity,
	LineChart,
	Bell,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { ContractSwitcher } from '@/components/contract-switcher';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from '@/components/ui/sidebar';

// This is sample data.
const data = {
	user: {
		name: 'shadcn',
		email: 'm@example.com',
		avatar: '/avatars/shadcn.jpg',
	},
	navMain: [
		{
			title: 'Home',
			url: '/dashboard',
			icon: LayoutDashboard,
			shortcut: '⌘⇧H',
			hotkey: 'mod+shift+h',
		},
		{
			title: 'Activity',
			url: '/dashboard/activity',
			icon: Activity,
			shortcut: '⌘⇧A',
			hotkey: 'mod+shift+a',
		},
		{
			title: 'Performance',
			url: '/dashboard/performance',
			icon: LineChart,
			shortcut: '⌘⇧P',
			hotkey: 'mod+shift+p',
		},
		{
			title: 'Alerts',
			url: '/dashboard/alerts',
			icon: Bell,
			shortcut: '⌘⇧C',
			hotkey: 'mod+shift+c',
		},
		{
			title: 'Settings',
			url: '/dashboard/settings',
			icon: Settings2,
			shortcut: '⌘⇧S',
			hotkey: 'mod+shift+s',
			items: [
				{
					title: 'General',
					url: '/dashboard/settings/general',
				},
				{
					title: 'Contracts',
					url: '/dashboard/settings/contracts',
				},
				{
					title: 'Account',
					url: '/dashboard/settings/account',
				},
			],
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const router = useRouter();

	// Create a single hotkey string with all shortcuts
	const hotkeyString = data.navMain.map((item) => item.hotkey).join(',');

	// Single hotkey handler for all navigation shortcuts
	useHotkeys(
		hotkeyString,
		(e) => {
			// Find the matching navigation item
			const item = data.navMain.find(
				(nav) => e.key.toLowerCase() === nav.hotkey.split('+').pop()
			);
			if (item) {
				router.push(item.url);
			}
		},
		{
			preventDefault: true,
			enableOnFormTags: true,
		},
		[router]
	);

	return (
		<Sidebar
			collapsible='icon'
			{...props}
		>
			<SidebarHeader>
				<ContractSwitcher />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
