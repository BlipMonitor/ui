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
import { HelpCircle, MessageSquare, Mail } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

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
	onCancel?: () => void;
	defaultValues?: AlertRule;
	submitText?: string;
}

export function RuleForm({
	onSubmit,
	onCancel,
	defaultValues,
	submitText = 'Create Rule',
}: RuleFormProps) {
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
		defaultValues: defaultValues || {
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
				e.preventDefault(); // Prevent default to ensure the shortcut works
				form.handleSubmit(onSubmit)();
			} else if (e.key === 'Escape' && onCancel) {
				e.preventDefault(); // Prevent default to ensure the shortcut works
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
					render={({ field }) => {
						// Convert single value to array for multi-select
						const selectedValues =
							field.value === 'both'
								? ['slack', 'email']
								: [field.value];

						const handleSelect = (value: string) => {
							const isSelected = selectedValues.includes(value);
							let newValues: string[];

							if (isSelected) {
								// Don't allow deselecting if it's the last selected option
								if (selectedValues.length === 1) return;
								newValues = selectedValues.filter(
									(v) => v !== value
								);
							} else {
								newValues = [...selectedValues, value];
							}

							// Convert back to single value format
							field.onChange(
								newValues.length === 2
									? 'both'
									: newValues[0] || 'email'
							);
						};

						return (
							<FormItem>
								<FormLabel>Notification Channels</FormLabel>
								<FormControl>
									<div className='flex items-center gap-4'>
										<div className='flex items-center space-x-2'>
											<Checkbox
												id='notification-email'
												checked={selectedValues.includes(
													'email'
												)}
												onCheckedChange={() =>
													handleSelect('email')
												}
											/>
											<label
												htmlFor='notification-email'
												className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1.5 cursor-pointer'
											>
												<Mail className='h-4 w-4' />
												Email
											</label>
										</div>
										<div className='flex items-center space-x-2'>
											<Checkbox
												id='notification-slack'
												checked={selectedValues.includes(
													'slack'
												)}
												onCheckedChange={() =>
													handleSelect('slack')
												}
											/>
											<label
												htmlFor='notification-slack'
												className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1.5 cursor-pointer'
											>
												<MessageSquare className='h-4 w-4' />
												Slack
											</label>
										</div>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>

				<div className='flex justify-end gap-3'>
					{onCancel && (
						<Button
							type='button'
							variant='outline'
							onClick={onCancel}
						>
							Cancel
						</Button>
					)}
					<Button type='submit'>{submitText}</Button>
				</div>
			</form>
		</Form>
	);
}
