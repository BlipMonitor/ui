'use client';

import { AlertRule } from '@/lib/schemas/alert-rule';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Mail, MessageSquare, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

type RuleWithId = AlertRule & { id: string };

export const columns: ColumnDef<RuleWithId>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className='-ml-4'
				>
					Rule Name
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
	},
	{
		accessorKey: 'contractId',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className='-ml-4'
				>
					Contract
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			const contractId = row.getValue('contractId') as string;
			return (
				<span className='font-mono'>{contractId.slice(0, 8)}...</span>
			);
		},
	},
	{
		accessorKey: 'conditionType',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className='-ml-4'
				>
					Condition
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			const type = row.getValue('conditionType') as string;
			const formattedType = type
				.split('_')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ');
			return formattedType;
		},
	},
	{
		accessorKey: 'threshold',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className='-ml-4'
				>
					Threshold
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			const type = row.getValue('conditionType') as string;
			const threshold = row.getValue('threshold') as number;
			const units = {
				failure_threshold: 'failures',
				gas_spike: '%',
				execution_time: 'ms',
			}[type];
			return type === 'gas_spike'
				? `${threshold}${units}`
				: `${threshold} ${units}`;
		},
	},
	{
		accessorKey: 'timeWindow',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className='-ml-4'
				>
					Time Window
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			const timeWindow = row.getValue('timeWindow') as number;
			const timeUnit = row.original.timeUnit;
			return `${timeWindow} ${timeUnit}`;
		},
	},
	{
		accessorKey: 'notificationChannel',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className='-ml-4'
				>
					Notifications
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			const channel = row.getValue('notificationChannel') as string;
			if (channel === 'both') {
				return (
					<div className='flex gap-2'>
						<Badge
							variant='outline'
							className='capitalize'
						>
							<MessageSquare className='mr-1 h-3 w-3' />
							Slack
						</Badge>
						<Badge
							variant='outline'
							className='capitalize'
						>
							<Mail className='mr-1 h-3 w-3' />
							Email
						</Badge>
					</div>
				);
			}
			return (
				<Badge
					variant='outline'
					className='capitalize'
				>
					{channel === 'slack' ? (
						<MessageSquare className='mr-1 h-3 w-3' />
					) : (
						<Mail className='mr-1 h-3 w-3' />
					)}
					{channel}
				</Badge>
			);
		},
	},
	{
		accessorKey: 'isActive',
		header: 'Status',
		cell: ({ row, table }) => {
			const isActive = row.getValue('isActive') as boolean;
			const handleRuleToggle = (
				table.options.meta as {
					handleRuleToggle?: (
						ruleId: string,
						checked: boolean
					) => void;
				}
			)?.handleRuleToggle;

			return (
				<div onClick={(e) => e.stopPropagation()}>
					<Switch
						checked={isActive}
						onCheckedChange={(checked: boolean) => {
							if (handleRuleToggle) {
								handleRuleToggle(row.original.id, checked);
							}
						}}
						aria-label='Toggle rule status'
					/>
				</div>
			);
		},
	},
	{
		id: 'actions',
		cell: ({ row, table }) => {
			const handleRuleEdit = (
				table.options.meta as {
					handleRuleEdit?: (ruleId: string) => void;
				}
			)?.handleRuleEdit;

			return (
				<div onClick={(e) => e.stopPropagation()}>
					<Button
						variant='ghost'
						size='icon'
						onClick={() => {
							if (handleRuleEdit) {
								handleRuleEdit(row.original.id);
							}
						}}
						className='h-8 w-8'
						aria-label='Edit rule'
					>
						<Pencil className='h-4 w-4' />
					</Button>
				</div>
			);
		},
	},
];
