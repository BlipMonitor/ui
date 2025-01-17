'use client';

import * as React from 'react';
import { Plus, Search } from 'lucide-react';
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
import { AddContractDialog } from '@/components/contracts/add-contract-dialog';
import { EditContractDialog } from '@/components/contracts/edit-contract-dialog';
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
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { type Contract } from '@/lib/schemas/contract';
import { generateMockContracts } from '@/lib/mock/contracts';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

export default function ContractsSettingsPage() {
	const [contracts, setContracts] = React.useState<Contract[]>([]);
	const [isLoading, setIsLoading] = React.useState(true);
	const [search, setSearch] = React.useState('');
	const [networkFilter, setNetworkFilter] = React.useState<string>('all');
	const [sortConfig, setSortConfig] = React.useState<{
		key: keyof Contract;
		direction: 'asc' | 'desc';
	}>({ key: 'friendlyName', direction: 'asc' });
	const { toast } = useToast();

	React.useEffect(() => {
		// Simulate loading state and fetch mock data
		const timer = setTimeout(() => {
			setContracts(generateMockContracts(5));
			setIsLoading(false);
		}, 1000);
		return () => clearTimeout(timer);
	}, []);

	const handleAddContract = (contract: Contract) => {
		setContracts((prev) => [...prev, contract]);
		toast({
			title: 'Contract Added',
			description: `${contract.friendlyName} has been added successfully.`,
		});
	};

	const handleEditContract = (updatedContract: Contract) => {
		setContracts((prev) =>
			prev.map((c) => (c.id === updatedContract.id ? updatedContract : c))
		);
	};

	const handleDeleteContract = (contract: Contract) => {
		setContracts((prev) => prev.filter((c) => c.id !== contract.id));
		toast({
			title: 'Contract Deleted',
			description: `${contract.friendlyName} has been deleted.`,
			variant: 'destructive',
		});
	};

	// Filter and sort contracts
	const filteredContracts = React.useMemo(() => {
		return contracts
			.filter((contract) => {
				const matchesSearch =
					search === '' ||
					contract.friendlyName
						.toLowerCase()
						.includes(search.toLowerCase()) ||
					contract.contractId
						.toLowerCase()
						.includes(search.toLowerCase());
				const matchesNetwork =
					networkFilter === 'all' ||
					contract.network === networkFilter;
				return matchesSearch && matchesNetwork;
			})
			.sort((a, b) => {
				const aValue = a[sortConfig.key];
				const bValue = b[sortConfig.key];
				const direction = sortConfig.direction === 'asc' ? 1 : -1;

				if (typeof aValue === 'string' && typeof bValue === 'string') {
					return aValue.localeCompare(bValue) * direction;
				}
				return 0;
			});
	}, [contracts, search, networkFilter, sortConfig]);

	const handleSort = (key: keyof Contract) => {
		setSortConfig((current) => ({
			key,
			direction:
				current.key === key && current.direction === 'asc'
					? 'desc'
					: 'asc',
		}));
	};

	return (
		<div className='space-y-3'>
			<div className='flex items-center justify-between'>
				<div>
					<h3 className='text-base font-medium'>
						Contract Management
					</h3>
					<p className='text-sm text-muted-foreground'>
						Manage your Soroban smart contracts
					</p>
				</div>
				<AddContractDialog
					onAdd={handleAddContract}
					trigger={
						<Button size='sm'>
							<Plus className='mr-2 h-4 w-4' />
							Add Contract
						</Button>
					}
				/>
			</div>

			<div className='flex items-center gap-3'>
				<div className='relative flex-1'>
					<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
					<Input
						placeholder='Search by name or contract ID...'
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className='pl-8'
					/>
				</div>
				<Select
					value={networkFilter}
					onValueChange={setNetworkFilter}
				>
					<SelectTrigger className='w-[140px]'>
						<SelectValue placeholder='Select network' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>All Networks</SelectItem>
						<SelectItem value='mainnet'>Mainnet</SelectItem>
						<SelectItem value='testnet'>Testnet</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead
								className='w-[200px] cursor-pointer'
								onClick={() => handleSort('friendlyName')}
							>
								Name{' '}
								{sortConfig.key === 'friendlyName' && (
									<span className='ml-1'>
										{sortConfig.direction === 'asc'
											? '↑'
											: '↓'}
									</span>
								)}
							</TableHead>
							<TableHead
								className='cursor-pointer'
								onClick={() => handleSort('contractId')}
							>
								Contract ID{' '}
								{sortConfig.key === 'contractId' && (
									<span className='ml-1'>
										{sortConfig.direction === 'asc'
											? '↑'
											: '↓'}
									</span>
								)}
							</TableHead>
							<TableHead
								className='w-[100px] cursor-pointer'
								onClick={() => handleSort('network')}
							>
								Network{' '}
								{sortConfig.key === 'network' && (
									<span className='ml-1'>
										{sortConfig.direction === 'asc'
											? '↑'
											: '↓'}
									</span>
								)}
							</TableHead>
							<TableHead className='w-[100px] text-right'>
								Actions
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							Array.from({ length: 3 }).map((_, index) => (
								<TableRow key={index}>
									<TableCell>
										<Skeleton className='h-5 w-[120px]' />
									</TableCell>
									<TableCell>
										<Skeleton className='h-5 w-[180px]' />
									</TableCell>
									<TableCell>
										<Skeleton className='h-5 w-[80px]' />
									</TableCell>
									<TableCell className='text-right'>
										<Skeleton className='ml-auto h-8 w-8' />
									</TableCell>
								</TableRow>
							))
						) : filteredContracts.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={4}
									className='h-[72px] text-center'
								>
									<p className='text-sm text-muted-foreground'>
										{contracts.length === 0
											? 'No contracts added yet. Add your first contract to get started.'
											: 'No contracts match your search criteria.'}
									</p>
								</TableCell>
							</TableRow>
						) : (
							filteredContracts.map((contract) => (
								<TableRow key={contract.id}>
									<TableCell className='font-medium'>
										{contract.friendlyName}
									</TableCell>
									<TableCell className='font-mono text-sm'>
										{contract.contractId}
									</TableCell>
									<TableCell>
										<span
											className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
												contract.network === 'mainnet'
													? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-500/20'
													: contract.network ===
													  'testnet'
													? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20 dark:bg-yellow-900/30 dark:text-yellow-400 dark:ring-yellow-500/20'
													: 'bg-purple-50 text-purple-700 ring-purple-600/20 dark:bg-purple-900/30 dark:text-purple-400 dark:ring-purple-500/20'
											}`}
										>
											{contract.network}
										</span>
									</TableCell>
									<TableCell className='text-right'>
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
												<EditContractDialog
													contract={contract}
													onSave={handleEditContract}
													trigger={
														<DropdownMenuItem
															onSelect={(e) =>
																e.preventDefault()
															}
														>
															Edit Contract
														</DropdownMenuItem>
													}
												/>
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
																Are you sure you
																want to delete{' '}
																<span className='font-medium'>
																	{
																		contract.friendlyName
																	}
																</span>
																? This action
																cannot be
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
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
