'use client';

import * as React from 'react';
import { ChevronsUpDown, Plus, Code2 } from 'lucide-react';
import { useHotkeys } from 'react-hotkeys-hook';
import { faker } from '@faker-js/faker';

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
import { AddContractDialog } from '@/components/contracts/add-contract-dialog';
import { generateMockContracts } from '@/lib/mock/contracts';

// Set a fixed seed for consistent mock data generation
faker.seed(123);

export function ContractSwitcher() {
	const { isMobile } = useSidebar();
	// Generate contracts only once and memoize the result
	const [contracts] = React.useState(() => {
		// Reset the seed before generating contracts to ensure consistency
		faker.seed(123);
		return generateMockContracts(5);
	});
	const [activeContract, setActiveContract] = React.useState(contracts[0]);
	const [dropdownOpen, setDropdownOpen] = React.useState(false);

	// Load stored contract on client-side only
	React.useEffect(() => {
		const stored = localStorage.getItem('activeContract');
		if (stored) {
			const parsedContract = JSON.parse(stored);
			// Find the matching contract from our generated list to maintain consistency
			const matchingContract = contracts.find(
				(c) => c.id === parsedContract.id
			);
			if (matchingContract) {
				setActiveContract(matchingContract);
			}
		}
	}, [contracts]);

	// Persist selected contract to localStorage
	React.useEffect(() => {
		localStorage.setItem('activeContract', JSON.stringify(activeContract));
	}, [activeContract]);

	// Create hotkey combinations for numbers 1-5 (since we generate 5 contracts)
	const hotkeyString = Array.from(
		{ length: contracts.length },
		(_, i) => `mod+${i + 1}`
	).join(', ');

	// Single hotkey handler for all number combinations
	useHotkeys(
		hotkeyString,
		(e) => {
			const num = e.key.match(/\d/)?.[0];
			if (num) {
				const index = parseInt(num) - 1;
				if (index >= 0 && index < contracts.length) {
					setActiveContract(contracts[index]);
				}
			}
		},
		{
			preventDefault: true,
			enableOnFormTags: true,
		},
		[setActiveContract, contracts]
	);

	const getShortcutKey = (index: number) => {
		if (index < 9) {
			return `⌘${index + 1}`;
		}
		return null;
	};

	// Helper function to truncate contract ID
	const truncateContractId = (contractId: string) => {
		if (contractId.length <= 12) return contractId;
		return `${contractId.slice(0, 4)}...${contractId.slice(-4)}`;
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu
					open={dropdownOpen}
					onOpenChange={setDropdownOpen}
				>
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
									{activeContract.friendlyName}
								</span>
								<div className='flex items-center gap-2'>
									<span className='truncate text-xs font-mono'>
										{truncateContractId(
											activeContract.contractId
										)}
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
						{contracts.map((contract, index) => (
							<DropdownMenuItem
								key={contract.id}
								onClick={() => setActiveContract(contract)}
								className='gap-2 p-2'
							>
								<div className='flex size-6 items-center justify-center rounded-sm border'>
									<Code2 className='size-4 shrink-0' />
								</div>
								<div className='flex flex-1 items-center gap-2'>
									<div className='flex-1'>
										<div>{contract.friendlyName}</div>
										<div className='text-xs font-mono text-muted-foreground'>
											{truncateContractId(
												contract.contractId
											)}
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
						<AddContractDialog
							onAdd={() => {}}
							trigger={
								<DropdownMenuItem
									className='gap-2 p-2'
									onSelect={(e) => e.preventDefault()}
								>
									<div className='flex size-6 items-center justify-center rounded-md border bg-background'>
										<Plus className='size-4' />
									</div>
									<div className='font-medium text-muted-foreground'>
										Add Contract
									</div>
								</DropdownMenuItem>
							}
							onOpenChange={(open) => {
								if (!open) setDropdownOpen(false);
							}}
						/>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
