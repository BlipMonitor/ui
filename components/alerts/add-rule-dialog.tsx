'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';
import { AlertRule } from '@/lib/schemas/alert-rule';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RuleForm } from './rule-form';
import { useToast } from '@/hooks/use-toast';

export function AddRuleDialog() {
	const [open, setOpen] = React.useState(false);
	const { toast } = useToast();

	const handleSubmit = (data: AlertRule) => {
		// TODO: Add API call to save rule
		console.log('Saving rule:', data);

		toast({
			title: 'Alert Rule Created',
			description: `Successfully created rule: ${data.name}`,
		});

		setOpen(false);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			<DialogTrigger asChild>
				<Button size='sm'>
					<Plus className='mr-2 h-4 w-4' />
					Add Rule
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[500px]'>
				<DialogHeader>
					<DialogTitle>Create Alert Rule</DialogTitle>
					<DialogDescription>
						Set up a new alert rule with conditions and notification
						preferences.
					</DialogDescription>
				</DialogHeader>
				<RuleForm
					onSubmit={handleSubmit}
					onCancel={() => setOpen(false)}
				/>
			</DialogContent>
		</Dialog>
	);
}
