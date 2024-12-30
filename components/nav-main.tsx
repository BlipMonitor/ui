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
	}[];
}) {
	const pathname = usePathname();

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Platform</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => {
					// For home page, only exact match
					if (item.url === '/dashboard') {
						const isActive = pathname === item.url;
						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									asChild
									tooltip={item.title}
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
					}

					// For other pages, check exact match or direct children
					const isActive =
						pathname === item.url ||
						pathname.startsWith(`${item.url}/`);

					return (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								asChild
								tooltip={item.title}
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
