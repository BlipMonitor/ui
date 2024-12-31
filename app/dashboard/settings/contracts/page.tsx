'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { AddContractDialog } from '@/components/add-contract-dialog';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Using the same sample contracts from contract-switcher for now
const sampleContracts = [
	{
		name: 'Token Contract',
		contractId: 'CACT...X4WY',
		network: 'mainnet',
	},
	{
		name: 'Liquidity Pool',
		contractId: 'CBXC...L9MN',
		network: 'mainnet',
	},
	{
		name: 'NFT Marketplace',
		contractId: 'CDEF...K3PQ',
		network: 'testnet',
	},
];

export default function ContractsSettingsPage() {
	const [contracts, setContracts] = React.useState(sampleContracts);

	const handleDeleteContract = (contract: (typeof sampleContracts)[0]) => {
		setContracts((prev) =>
			prev.filter((c) => c.contractId !== contract.contractId)
		);
	};

	return (
		<div className='rounded-md border'>
			<div className='flex items-center justify-between p-4'>
				<div>
					<h3 className='text-lg font-medium'>Contract List</h3>
					<p className='text-sm text-muted-foreground'>
						Manage your monitored Soroban contracts.
					</p>
				</div>
				<AddContractDialog
					trigger={
						<Button>
							<Plus className='mr-2 h-4 w-4' />
							Add Contract
						</Button>
					}
				/>
			</div>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Contract ID</TableHead>
						<TableHead>Network</TableHead>
						<TableHead className='w-[100px]'>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{contracts.map((contract) => (
						<TableRow key={contract.contractId}>
							<TableCell className='font-medium'>
								{contract.name}
							</TableCell>
							<TableCell className='font-mono'>
								{contract.contractId}
							</TableCell>
							<TableCell>
								<span
									className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
										contract.network === 'mainnet'
											? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
											: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
									}`}
								>
									{contract.network}
								</span>
							</TableCell>
							<TableCell>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant='ghost'
											className='h-8 w-8 p-0'
										>
											<span className='sr-only'>
												Open menu
											</span>
											<svg
												className='h-4 w-4'
												xmlns='http://www.w3.org/2000/svg'
												viewBox='0 0 24 24'
												fill='none'
												stroke='currentColor'
												strokeWidth='2'
												strokeLinecap='round'
												strokeLinejoin='round'
											>
												<circle
													cx='12'
													cy='12'
													r='1'
												/>
												<circle
													cx='12'
													cy='5'
													r='1'
												/>
												<circle
													cx='12'
													cy='19'
													r='1'
												/>
											</svg>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align='end'>
										<DropdownMenuLabel>
											Actions
										</DropdownMenuLabel>
										<DropdownMenuItem
											onClick={() =>
												console.log('Edit', contract)
											}
										>
											Edit Contract
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<DropdownMenuItem
													className='text-destructive focus:bg-destructive focus:text-destructive-foreground'
													onSelect={(e) =>
														e.preventDefault()
													}
												>
													Delete Contract
												</DropdownMenuItem>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>
														Delete Contract
													</AlertDialogTitle>
													<AlertDialogDescription>
														Are you sure you want to
														delete{' '}
														<span className='font-medium'>
															{contract.name}
														</span>
														? This action cannot be
														undone.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>
														Cancel
													</AlertDialogCancel>
													<AlertDialogAction
														onClick={() =>
															handleDeleteContract(
																contract
															)
														}
														className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
													>
														Delete
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
