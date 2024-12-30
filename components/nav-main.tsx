'use client';

import { type LucideIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon?: LucideIcon;
		shortcut?: string;
	}[];
}) {
	const pathname = usePathname();

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Platform</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => {
					const isActive = pathname === item.url;
					return (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								asChild
								tooltip={
									item.shortcut
										? `${item.title} (${item.shortcut})`
										: item.title
								}
								className={cn(
									isActive &&
										'bg-sidebar-accent text-sidebar-accent-foreground'
								)}
							>
								<a href={item.url}>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
