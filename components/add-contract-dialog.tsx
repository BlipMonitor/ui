'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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

const formSchema = z.object({
	contractId: z
		.string()
		.min(1, 'Contract ID is required')
		.regex(/^C[A-Z0-9]{55}$/, 'Invalid Soroban Contract ID format'),
	friendlyName: z
		.string()
		.min(1, 'Name is required')
		.max(50, 'Name must be less than 50 characters'),
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
		},
	});

	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen);
		onOpenChange?.(newOpen);
	};

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
				{trigger || <Button>Add Contract</Button>}
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
