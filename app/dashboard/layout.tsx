'use client';

import * as React from 'react';
import { useSelectedLayoutSegments } from 'next/navigation';
import { AppSidebar } from '@/components/app-sidebar';
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// Define all possible breadcrumb titles including nested routes
const breadcrumbTitles: { [key: string]: string } = {
	dashboard: 'Home',
	activity: 'Activity',
	events: 'Events',
	logs: 'Logs',
	performance: 'Performance',
	metrics: 'Metrics',
	alerts: 'Alerts',
	settings: 'Settings',
	contracts: 'Contracts',
	account: 'Account',
	general: 'General',
};

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const segments = useSelectedLayoutSegments();

	const breadcrumbs = React.useMemo(() => {
		// Always start with Home
		const items = [
			{
				title: 'Home',
				href: '/dashboard',
				isActive: segments.length === 0,
			},
		];

		// Build up the breadcrumb path
		let path = '/dashboard';
		segments.forEach((segment, index) => {
			path += `/${segment}`;
			items.push({
				title: breadcrumbTitles[segment] || segment,
				href: path,
				isActive: index === segments.length - 1,
			});
		});

		return items;
	}, [segments]);

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
					<div className='flex items-center gap-2 px-4'>
						<SidebarTrigger className='-ml-1' />
						<Separator
							orientation='vertical'
							className='mr-2 h-4'
						/>
						<Breadcrumb>
							<BreadcrumbList>
								{breadcrumbs.map((item, index) => (
									<React.Fragment key={item.href}>
										<BreadcrumbItem>
											{item.isActive ? (
												<BreadcrumbPage>
													{item.title}
												</BreadcrumbPage>
											) : (
												<BreadcrumbLink
													href={item.href}
												>
													{item.title}
												</BreadcrumbLink>
											)}
										</BreadcrumbItem>
										{index < breadcrumbs.length - 1 && (
											<BreadcrumbSeparator />
										)}
									</React.Fragment>
								))}
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>
				{children}
			</SidebarInset>
		</SidebarProvider>
	);
}
