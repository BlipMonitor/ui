'use client';

import { AlertRule } from '@/lib/schemas/alert-rule';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { RuleForm } from './rule-form';
import { useToast } from '@/hooks/use-toast';

interface EditRuleDialogProps {
	rule: AlertRule & { id: string };
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onRuleEdit: (ruleId: string, rule: AlertRule) => void;
}

export function EditRuleDialog({
	rule,
	open,
	onOpenChange,
	onRuleEdit,
}: EditRuleDialogProps) {
	const { toast } = useToast();

	const handleSubmit = async (data: AlertRule) => {
		try {
			onRuleEdit(rule.id, data);
			onOpenChange(false);

			// Create a list of changes with title case
			const changes: string[] = [];
			if (rule.name !== data.name) changes.push('Name');
			if (rule.conditionType !== data.conditionType)
				changes.push('Condition Type');
			if (rule.threshold !== data.threshold) changes.push('Threshold');
			if (
				rule.timeWindow !== data.timeWindow ||
				rule.timeUnit !== data.timeUnit
			)
				changes.push('Time Window');
			if (rule.notificationChannel !== data.notificationChannel)
				changes.push('Notification Channel');

			toast({
				title: 'Rule Updated',
				description: (
					<div className='flex flex-col gap-1'>
						<p>
							<span className='font-medium'>
								&ldquo;{data.name}&rdquo;
							</span>{' '}
							has been updated.
						</p>
						{changes.length > 0 && (
							<p className='text-sm text-muted-foreground'>
								Changed: {changes.join(', ')}
							</p>
						)}
					</div>
				),
			});
		} catch (error: unknown) {
			console.error('Failed to update rule:', error);
			toast({
				title: 'Error',
				description:
					'Failed to update the alert rule. Please try again.',
				variant: 'destructive',
			});
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Edit Alert Rule</DialogTitle>
					<DialogDescription>
						Make changes to your alert rule here. Click save when
						you&apos;re done.
					</DialogDescription>
				</DialogHeader>
				<RuleForm
					defaultValues={rule}
					onSubmit={handleSubmit}
					submitText='Save changes'
					onCancel={() => onOpenChange(false)}
				/>
			</DialogContent>
		</Dialog>
	);
}
