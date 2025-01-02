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
			toast({
				title: 'Rule updated',
				description: 'The alert rule has been updated successfully.',
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
