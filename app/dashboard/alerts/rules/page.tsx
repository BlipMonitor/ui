'use client';

import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddRuleDialog } from '@/components/alerts/add-rule-dialog';
import { EditRuleDialog } from '@/components/alerts/edit-rule-dialog';
import { columns } from './columns';
import { DataTable } from './data-table';
import { generateMockRules } from '@/lib/mock/alert-rules';
import { useState, useEffect } from 'react';
import { AlertRule } from '@/lib/schemas/alert-rule';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

type RuleWithId = AlertRule & { id: string };

export default function AlertRulesPage() {
	const router = useRouter();
	const { toast } = useToast();
	const [rules, setRules] = useState<RuleWithId[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedRule, setSelectedRule] = useState<RuleWithId | null>(null);
	const [editDialogOpen, setEditDialogOpen] = useState(false);

	useEffect(() => {
		// Simulate API call to fetch rules
		setTimeout(() => {
			setRules(generateMockRules());
			setLoading(false);
		}, 1000);
	}, []);

	const handleRuleAdd = (rule: AlertRule) => {
		const newRule = {
			...rule,
			id: Math.random().toString(36).substring(7),
		};
		setRules((prev) => [...prev, newRule]);
	};

	const handleRuleEdit = (ruleId: string, updatedRule: AlertRule) => {
		setRules((prev) =>
			prev.map((rule) =>
				rule.id === ruleId ? { ...updatedRule, id: rule.id } : rule
			)
		);
	};

	const handleRuleToggle = (ruleId: string, checked: boolean) => {
		setRules((prev) =>
			prev.map((rule) =>
				rule.id === ruleId ? { ...rule, isActive: checked } : rule
			)
		);

		const rule = rules.find((r) => r.id === ruleId);
		if (rule) {
			toast({
				title: checked ? 'Rule Activated' : 'Rule Deactivated',
				description: `"${rule.name}" has been ${
					checked ? 'activated' : 'deactivated'
				}.`,
				variant: checked ? 'default' : 'destructive',
			});
		}
	};

	if (loading) {
		return (
			<div className='flex flex-1 flex-col gap-4 p-4'>
				<div className='flex items-center justify-between'>
					<Skeleton className='h-8 w-32' />
					<div className='flex items-center gap-2'>
						<Skeleton className='h-9 w-48' />
						<Skeleton className='h-9 w-24' />
					</div>
				</div>
				<Skeleton className='h-[500px] w-full' />
			</div>
		);
	}

	return (
		<div className='flex flex-1 flex-col gap-4 p-4'>
			<div className='flex items-center justify-between'>
				<h1 className='text-lg font-medium'>Alert Rules</h1>
				<div className='flex items-center gap-2'>
					<Button
						variant='outline'
						size='sm'
						onClick={() => {
							router.push('/dashboard/alerts/settings');
						}}
					>
						<Bell className='mr-2 h-4 w-4' />
						Configure Notifications
					</Button>
					<AddRuleDialog onRuleAdd={handleRuleAdd} />
				</div>
			</div>
			<DataTable
				columns={columns}
				data={rules}
				onRuleToggle={handleRuleToggle}
				onRuleEdit={(ruleId) => {
					const rule = rules.find((r) => r.id === ruleId);
					if (rule) {
						setSelectedRule(rule);
						setEditDialogOpen(true);
					}
				}}
			/>
			{selectedRule && (
				<EditRuleDialog
					rule={selectedRule}
					open={editDialogOpen}
					onOpenChange={setEditDialogOpen}
					onRuleEdit={handleRuleEdit}
				/>
			)}
		</div>
	);
}
