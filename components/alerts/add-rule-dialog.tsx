'use client';

import * as React from 'react';
import { Plus, CheckCircle2 } from 'lucide-react';
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

interface AddRuleDialogProps {
	onRuleAdd?: (rule: AlertRule) => void;
}

export function AddRuleDialog({ onRuleAdd }: AddRuleDialogProps) {
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

		// Call the onRuleAdd callback if provided
		onRuleAdd?.(data);

		toast({
			title: 'Alert Rule Created',
			description: (
				<div className='flex flex-col gap-2'>
					<div className='flex items-center gap-2'>
						<CheckCircle2 className='h-4 w-4 text-green-500' />
						<p>
							Successfully created rule:{' '}
							<span className='font-medium'>{data.name}</span>
						</p>
					</div>
					<p className='text-xs text-muted-foreground'>
						You will be notified when the conditions are met.
					</p>
				</div>
			),
			duration: 5000,
		});

		setOpen(false);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			<TooltipProvider>
				<Tooltip>
					<DialogTrigger asChild>
						<TooltipTrigger asChild>
							<Button size='sm'>
								<Plus className='mr-2 h-4 w-4' />
								Add Rule
							</Button>
						</TooltipTrigger>
					</DialogTrigger>
					<TooltipContent>
						<p>Press ⌘K to open</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
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
