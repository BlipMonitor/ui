'use client';

import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddRuleDialog } from '@/components/alerts/add-rule-dialog';
import { columns } from './columns';
import { DataTable } from './data-table';
import { generateMockRules } from '@/lib/mock/alert-rules';
import { useState, useEffect } from 'react';
import { AlertRule } from '@/lib/schemas/alert-rule';
import { Skeleton } from '@/components/ui/skeleton';

type RuleWithId = AlertRule & { id: string };

export default function AlertRulesPage() {
	const router = useRouter();
	const [rules, setRules] = useState<RuleWithId[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Simulate API call delay
		const timer = setTimeout(() => {
			setRules(generateMockRules());
			setIsLoading(false);
		}, 1000);

		return () => clearTimeout(timer);
	}, []);

	const handleRuleClick = (rule: RuleWithId) => {
		// We'll implement the drawer in Issue #38
		console.log('Rule clicked:', rule);
	};

	const handleRuleToggle = (ruleId: string, checked: boolean) => {
		setRules((prevRules) =>
			prevRules.map((rule) =>
				rule.id === ruleId ? { ...rule, isActive: checked } : rule
			)
		);
	};

	const handleRuleAdd = (rule: AlertRule) => {
		// Generate a temporary ID for the new rule
		const newRule: RuleWithId = {
			...rule,
			id: `rule-${Date.now()}`, // In production, this would come from the backend
		};
		setRules((prevRules) => [...prevRules, newRule]);
	};

	if (isLoading) {
		return (
			<div className='flex flex-1 flex-col gap-4 p-4'>
				<div className='flex items-center justify-between'>
					<Skeleton className='h-6 w-32' />
					<div className='flex items-center gap-2'>
						<Skeleton className='h-9 w-[180px]' />
						<Skeleton className='h-9 w-[120px]' />
					</div>
				</div>
				<div className='space-y-2'>
					<Skeleton className='h-12 w-full' />
					<Skeleton className='h-12 w-full' />
					<Skeleton className='h-12 w-full' />
				</div>
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
				onRowClick={handleRuleClick}
				onRuleToggle={handleRuleToggle}
			/>
		</div>
	);
}
