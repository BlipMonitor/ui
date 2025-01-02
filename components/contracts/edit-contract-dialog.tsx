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
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

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

interface EditContractDialogProps {
	contract: {
		id: string;
		contractId: string;
		friendlyName: string;
		network: 'mainnet' | 'testnet';
	};
	onSave: (contract: FormValues & { id: string }) => void;
	trigger?: React.ReactNode;
	onOpenChange?: (open: boolean) => void;
}

export function EditContractDialog({
	contract,
	onSave,
	trigger,
	onOpenChange,
}: EditContractDialogProps) {
	const [open, setOpen] = React.useState(false);
	const { toast } = useToast();
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			contractId: contract.contractId,
			friendlyName: contract.friendlyName,
			network: contract.network,
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
		onSave({ ...data, id: contract.id });
		handleOpenChange(false);
		toast({
			title: 'Contract Updated',
			description: `${data.friendlyName} has been updated successfully.`,
		});
		form.reset();
	}

	return (
		<Dialog
			open={open}
			onOpenChange={handleOpenChange}
		>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Edit Contract</DialogTitle>
					<DialogDescription>
						Update your Soroban contract details below.
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
								onClick={() => handleOpenChange(false)}
							>
								Cancel
							</Button>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button type='submit'>
											Save Changes
										</Button>
									</TooltipTrigger>
									<TooltipContent side='bottom'>
										<div className='flex items-center gap-1'>
											Press
											<div className='pointer-events-none rounded border bg-muted px-1.5 font-mono text-[10px]'>
												<span className='text-xs'>
													⌘
												</span>
												K
											</div>
											to edit
										</div>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
