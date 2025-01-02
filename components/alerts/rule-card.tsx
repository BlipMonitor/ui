import { Bell, MoreVertical, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';

interface RuleCardProps {
	name: string;
	description: string;
	isEnabled: boolean;
	onToggle: (enabled: boolean) => void;
	onEdit: () => void;
	onDelete: () => void;
	triggerCount: number;
}

export function RuleCard({
	name,
	description,
	isEnabled,
	onToggle,
	onEdit,
	onDelete,
	triggerCount,
}: RuleCardProps) {
	return (
		<Card>
			<CardHeader className='flex flex-row items-start justify-between space-y-0 pb-2'>
				<div className='flex items-start gap-4'>
					<Bell className='mt-0.5 h-4 w-4 text-muted-foreground' />
					<div className='space-y-1'>
						<h4 className='text-sm font-semibold leading-none'>
							{name}
						</h4>
						<div className='flex items-center gap-2'>
							<Switch
								checked={isEnabled}
								onCheckedChange={onToggle}
								size='sm'
							/>
							<span className='text-xs text-muted-foreground'>
								{isEnabled ? 'Enabled' : 'Disabled'}
							</span>
						</div>
					</div>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger className='h-8 w-8 rounded-md p-0 hover:bg-muted'>
						<MoreVertical className='h-4 w-4' />
						<span className='sr-only'>Open menu</span>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuItem onClick={onEdit}>
							<Settings className='mr-2 h-4 w-4' />
							Edit Rule
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={onDelete}
							className='text-destructive focus:text-destructive'
						>
							<Settings className='mr-2 h-4 w-4' />
							Delete Rule
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</CardHeader>
			<CardContent>
				<p className='text-sm text-muted-foreground'>{description}</p>
				<div className='mt-2 text-xs text-muted-foreground'>
					Triggered {triggerCount} times in the last 24 hours
				</div>
			</CardContent>
		</Card>
	);
}
