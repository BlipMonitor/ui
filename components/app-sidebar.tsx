'use client';

import * as React from 'react';
import {
	AudioWaveform,
	Command,
	GalleryVerticalEnd,
	Settings2,
	LayoutDashboard,
	Activity,
	LineChart,
	Bell,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
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
	teams: [
		{
			name: 'Acme Inc',
			logo: GalleryVerticalEnd,
			plan: 'Enterprise',
		},
		{
			name: 'Acme Corp.',
			logo: AudioWaveform,
			plan: 'Startup',
		},
		{
			name: 'Evil Corp.',
			logo: Command,
			plan: 'Free',
		},
	],
	navMain: [
		{
			title: 'Home',
			url: '/dashboard',
			icon: LayoutDashboard,
		},
		{
			title: 'Activity',
			url: '/dashboard/activity',
			icon: Activity,
		},
		{
			title: 'Performance',
			url: '/dashboard/performance',
			icon: LineChart,
		},
		{
			title: 'Alerts',
			url: '/dashboard/alerts',
			icon: Bell,
		},
		{
			title: 'Settings',
			url: '/dashboard/settings',
			icon: Settings2,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar
			collapsible='icon'
			{...props}
		>
			<SidebarHeader>
				<TeamSwitcher teams={data.teams} />
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
