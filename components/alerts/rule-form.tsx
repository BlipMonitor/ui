'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	AlertRule,
	alertRuleSchema,
	conditionDescriptions,
	thresholdUnits,
	defaultThresholds,
} from '@/lib/schemas/alert-rule';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

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

interface RuleFormProps {
	onSubmit: (data: AlertRule) => void;
	onCancel: () => void;
}

export function RuleForm({ onSubmit, onCancel }: RuleFormProps) {
	// Get the currently selected contract from localStorage
	const storedContract = React.useMemo(() => {
		if (typeof window !== 'undefined') {
			const stored = localStorage.getItem('activeContract');
			if (stored) {
				return JSON.parse(stored);
			}
		}
		return null;
	}, []);

	const form = useForm<AlertRule>({
		resolver: zodResolver(alertRuleSchema),
		defaultValues: {
			name: '', // Only field without a default
			contractId:
				storedContract?.contractId || sampleContracts[0].contractId,
			conditionType: 'failure_threshold',
			threshold: defaultThresholds.failure_threshold,
			timeWindow: 1,
			timeUnit: 'hours',
			notificationChannel: 'email',
			isActive: true,
		},
	});

	// Update threshold when condition type changes
	React.useEffect(() => {
		const subscription = form.watch((value, { name }) => {
			if (name === 'conditionType') {
				const type =
					value.conditionType as keyof typeof defaultThresholds;
				form.setValue('threshold', defaultThresholds[type]);
			}
		});
		return () => subscription.unsubscribe();
	}, [form]);

	// Handle keyboard shortcuts
	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
				form.handleSubmit(onSubmit)();
			} else if (e.key === 'Escape') {
				onCancel();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [form, onSubmit, onCancel]);

	const selectedConditionType = form.watch(
		'conditionType'
	) as keyof typeof thresholdUnits;

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-6'
			>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Rule Name</FormLabel>
							<FormControl>
								<Input
									placeholder='e.g., High Gas Usage Alert'
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Use letters, numbers, spaces, hyphens, and
								underscores only
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='contractId'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Contract</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder='Select a contract' />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{sampleContracts.map((contract) => (
										<SelectItem
											key={contract.contractId}
											value={contract.contractId}
										>
											<div className='flex flex-col'>
												<span>{contract.name}</span>
												<span className='text-xs text-muted-foreground font-mono'>
													{contract.contractId}
												</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='conditionType'
					render={({ field }) => (
						<FormItem>
							<div className='flex items-center gap-2'>
								<FormLabel>Condition Type</FormLabel>
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<HelpCircle className='h-4 w-4 text-muted-foreground' />
										</TooltipTrigger>
										<TooltipContent>
											<p>
												{
													conditionDescriptions[
														field.value as keyof typeof conditionDescriptions
													]
												}
											</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder='Select a condition type' />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value='failure_threshold'>
										Failure Threshold
									</SelectItem>
									<SelectItem value='gas_spike'>
										Gas Usage Spike
									</SelectItem>
									<SelectItem value='execution_time'>
										Execution Time
									</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='threshold'
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Threshold Value (
								{thresholdUnits[selectedConditionType]})
							</FormLabel>
							<FormControl>
								<Input
									type='number'
									min={
										selectedConditionType ===
										'failure_threshold'
											? 1
											: selectedConditionType ===
											  'gas_spike'
											? 10
											: 100
									}
									max={
										selectedConditionType ===
										'failure_threshold'
											? 100
											: selectedConditionType ===
											  'gas_spike'
											? 1000
											: 30000
									}
									placeholder={`Enter threshold in ${thresholdUnits[selectedConditionType]}`}
									{...field}
									onChange={(e) =>
										field.onChange(Number(e.target.value))
									}
								/>
							</FormControl>
							<FormDescription>
								{selectedConditionType ===
									'failure_threshold' &&
									'Number of failures to trigger the alert'}
								{selectedConditionType === 'gas_spike' &&
									'Percentage increase in gas usage above normal'}
								{selectedConditionType === 'execution_time' &&
									'Maximum execution time in milliseconds'}
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='grid grid-cols-2 gap-4'>
					<FormField
						control={form.control}
						name='timeWindow'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Time Window</FormLabel>
								<FormControl>
									<Input
										type='number'
										min={1}
										max={168}
										placeholder='e.g., 1'
										{...field}
										onChange={(e) =>
											field.onChange(
												Number(e.target.value)
											)
										}
									/>
								</FormControl>
								<FormDescription>
									Enter a whole number between 1 and 168
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='timeUnit'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Time Unit</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder='Select unit' />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value='minutes'>
											Minutes
										</SelectItem>
										<SelectItem value='hours'>
											Hours
										</SelectItem>
										<SelectItem value='days'>
											Days
										</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name='notificationChannel'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Notification Channel</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder='Select notification channel' />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value='slack'>Slack</SelectItem>
									<SelectItem value='email'>Email</SelectItem>
									<SelectItem value='both'>Both</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='flex justify-end space-x-4'>
					<Button
						variant='outline'
						onClick={onCancel}
					>
						Cancel
					</Button>
					<Button type='submit'>
						Save Rule
						<kbd className='pointer-events-none ml-2 hidden select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:inline-flex'>
							<span className='text-xs'>⌘</span>⏎
						</kbd>
					</Button>
				</div>
			</form>
		</Form>
	);
}
