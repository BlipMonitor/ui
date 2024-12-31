'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useHotkeys } from 'react-hotkeys-hook';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const formSchema = z.object({
	contractId: z
		.string()
		.min(1, 'Contract ID is required')
		.regex(/^C[A-Z0-9]{55}$/, 'Invalid Soroban Contract ID format'),
	friendlyName: z
		.string()
		.min(1, 'Name is required')
		.max(50, 'Name must be less than 50 characters'),
	network: z.enum(['mainnet', 'testnet'], {
		required_error: 'Please select a network',
	}),
});

type FormValues = z.infer<typeof formSchema>;

interface AddContractDialogProps {
	trigger?: React.ReactNode;
	onOpenChange?: (open: boolean) => void;
}

export function AddContractDialog({
	trigger,
	onOpenChange,
}: AddContractDialogProps) {
	const [open, setOpen] = React.useState(false);
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			contractId: '',
			friendlyName: '',
			network: 'mainnet',
		},
	});

	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen);
		onOpenChange?.(newOpen);
	};

	// Add hotkey to open dialog
	useHotkeys(
		'mod+k',
		(e) => {
			e.preventDefault();
			handleOpenChange(true);
		},
		{
			enableOnFormTags: true,
			preventDefault: true,
		},
		[handleOpenChange]
	);

	function onSubmit(data: FormValues) {
		// For MVP, just log the data
		console.log('Contract Data:', data);
		handleOpenChange(false);
		form.reset();
	}

	return (
		<Dialog
			open={open}
			onOpenChange={handleOpenChange}
		>
			<DialogTrigger asChild>
				{trigger || (
					<Button>
						Add Contract
						<kbd className='pointer-events-none ml-2 hidden select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:inline-flex'>
							<span className='text-xs'>⌘</span>K
						</kbd>
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Add Contract</DialogTitle>
					<DialogDescription>
						Enter your Soroban contract details below to start
						monitoring.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4'
					>
						<FormField
							control={form.control}
							name='contractId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Contract ID</FormLabel>
									<FormControl>
										<Input
											placeholder='C...'
											{...field}
											className='font-mono'
										/>
									</FormControl>
									<FormDescription>
										Your Soroban contract ID starting with C
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='friendlyName'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Friendly Name</FormLabel>
									<FormControl>
										<Input
											placeholder='My Token Contract'
											{...field}
										/>
									</FormControl>
									<FormDescription>
										A memorable name for this contract
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='network'
							render={({ field }) => (
								<FormItem className='space-y-3'>
									<FormLabel>Network</FormLabel>
									<FormControl>
										<RadioGroup
											onValueChange={field.onChange}
											defaultValue={field.value}
											className='flex space-x-4'
										>
											<FormItem className='flex items-center space-x-2 space-y-0'>
												<FormControl>
													<RadioGroupItem value='mainnet' />
												</FormControl>
												<FormLabel className='font-normal'>
													Mainnet
												</FormLabel>
											</FormItem>
											<FormItem className='flex items-center space-x-2 space-y-0'>
												<FormControl>
													<RadioGroupItem value='testnet' />
												</FormControl>
												<FormLabel className='font-normal'>
													Testnet
												</FormLabel>
											</FormItem>
										</RadioGroup>
									</FormControl>
									<FormDescription>
										Select the network this contract is
										deployed on
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className='flex justify-end space-x-4 pt-4'>
							<Button
								type='button'
								variant='outline'
								onClick={() => setOpen(false)}
							>
								Cancel
							</Button>
							<Button type='submit'>Add Contract</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
