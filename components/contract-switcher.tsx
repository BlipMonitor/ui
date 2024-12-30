'use client';

import * as React from 'react';
import { ChevronsUpDown, Plus, Code2 } from 'lucide-react';
import { useHotkeys } from 'react-hotkeys-hook';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

// Sample contract data - in real app, this would come from API/localStorage
const sampleContracts = [
	{
		name: 'Token Contract',
		contractId: 'GACT...X4WY',
		network: 'mainnet',
	},
	{
		name: 'Liquidity Pool',
		contractId: 'GBXC...L9MN',
		network: 'mainnet',
	},
	{
		name: 'NFT Marketplace',
		contractId: 'GDEF...K3PQ',
		network: 'testnet',
	},
];

export function ContractSwitcher() {
	const { isMobile } = useSidebar();
	const [activeContract, setActiveContract] = React.useState(() => {
		const stored = localStorage.getItem('activeContract');
		return stored ? JSON.parse(stored) : sampleContracts[0];
	});

	// Persist selected contract to localStorage
	React.useEffect(() => {
		localStorage.setItem('activeContract', JSON.stringify(activeContract));
	}, [activeContract]);

	// Create hotkey combinations for numbers 1-9
	const hotkeyString = Array.from(
		{ length: 9 },
		(_, i) => `mod+${i + 1}`
	).join(', ');

	// Single hotkey handler for all number combinations
	useHotkeys(
		hotkeyString,
		(e) => {
			const num = e.key.match(/\d/)?.[0];
			if (num) {
				const index = parseInt(num) - 1;
				if (index >= 0 && index < sampleContracts.length) {
					setActiveContract(sampleContracts[index]);
				}
			}
		},
		{
			preventDefault: true,
			enableOnFormTags: true,
		},
		[setActiveContract]
	);

	const getShortcutKey = (index: number) => {
		if (index < 9) {
			return `⌘${index + 1}`;
		}
		return null;
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size='lg'
							className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
						>
							<div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
								<Code2 className='size-4' />
							</div>
							<div className='grid flex-1 text-left text-sm leading-tight'>
								<span className='truncate font-semibold'>
									{activeContract.name}
								</span>
								<div className='flex items-center gap-2'>
									<span className='truncate text-xs font-mono'>
										{activeContract.contractId}
									</span>
									<span
										className={cn(
											'size-2 rounded-full',
											activeContract.network === 'mainnet'
												? 'bg-green-500'
												: 'bg-yellow-500'
										)}
										title={`${activeContract.network} contract`}
									/>
								</div>
							</div>
							<ChevronsUpDown className='ml-auto' />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
						align='start'
						side={isMobile ? 'bottom' : 'right'}
						sideOffset={4}
					>
						<DropdownMenuLabel className='text-xs text-muted-foreground'>
							Contracts
						</DropdownMenuLabel>
						{sampleContracts.map((contract, index) => (
							<DropdownMenuItem
								key={contract.contractId}
								onClick={() => setActiveContract(contract)}
								className='gap-2 p-2'
							>
								<div className='flex size-6 items-center justify-center rounded-sm border'>
									<Code2 className='size-4 shrink-0' />
								</div>
								<div className='flex flex-1 items-center gap-2'>
									<div className='flex-1'>
										<div>{contract.name}</div>
										<div className='text-xs font-mono text-muted-foreground'>
											{contract.contractId}
										</div>
									</div>
									<span
										className={cn(
											'size-2 rounded-full',
											contract.network === 'mainnet'
												? 'bg-green-500'
												: 'bg-yellow-500'
										)}
										title={`${contract.network} contract`}
									/>
								</div>
								{getShortcutKey(index) && (
									<DropdownMenuShortcut>
										{getShortcutKey(index)}
									</DropdownMenuShortcut>
								)}
							</DropdownMenuItem>
						))}
						<DropdownMenuSeparator />
						<DropdownMenuItem className='gap-2 p-2'>
							<div className='flex size-6 items-center justify-center rounded-md border bg-background'>
								<Plus className='size-4' />
							</div>
							<div className='font-medium text-muted-foreground'>
								Add Contract
							</div>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
