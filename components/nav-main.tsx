'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from '@/components/ui/sidebar';

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon?: LucideIcon;
		items?: {
			title: string;
			url: string;
		}[];
	}[];
}) {
	const pathname = usePathname();

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Platform</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => {
					// For items with subitems, use Collapsible
					if (item.items?.length) {
						const isActive = pathname.startsWith(item.url);
						return (
							<Collapsible
								key={item.title}
								asChild
								defaultOpen={isActive}
								className='group/collapsible'
							>
								<SidebarMenuItem>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton tooltip={item.title}>
											{item.icon && <item.icon />}
											<span>{item.title}</span>
											<ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
										</SidebarMenuButton>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub>
											{item.items.map((subItem) => {
												const isSubActive =
													pathname.startsWith(
														subItem.url
													);
												return (
													<SidebarMenuSubItem
														key={subItem.title}
													>
														<SidebarMenuSubButton
															asChild
															className={cn(
																isSubActive &&
																	'bg-sidebar-accent text-sidebar-accent-foreground'
															)}
														>
															<a
																href={
																	subItem.url
																}
															>
																<span>
																	{
																		subItem.title
																	}
																</span>
															</a>
														</SidebarMenuSubButton>
													</SidebarMenuSubItem>
												);
											})}
										</SidebarMenuSub>
									</CollapsibleContent>
								</SidebarMenuItem>
							</Collapsible>
						);
					}

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

					// For other pages without subitems
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
