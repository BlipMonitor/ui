'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';
import { useHotkeys } from 'react-hotkeys-hook';
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
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { RuleForm } from './rule-form';
import { useToast } from '@/hooks/use-toast';

export function AddRuleDialog() {
	const [open, setOpen] = React.useState(false);
	const { toast } = useToast();

	// Add hotkey to open dialog
	useHotkeys(
		'mod+k',
		(e) => {
			e.preventDefault();
			setOpen(true);
		},
		{
			enableOnFormTags: true,
			preventDefault: true,
		},
		[setOpen]
	);

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
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								size='sm'
								onClick={() => setOpen(true)}
							>
								<Plus className='mr-2 h-4 w-4' />
								Add Rule
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Press ⌘K to open</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
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
