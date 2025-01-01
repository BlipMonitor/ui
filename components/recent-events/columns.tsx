import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export interface Event {
	id: string;
	timestamp: Date;
	function: string;
	outcome: 'success' | 'failure';
}

export const columns: ColumnDef<Event>[] = [
	{
		accessorKey: 'timestamp',
		header: 'Time',
		cell: ({ row }) => {
			return format(row.getValue('timestamp'), 'HH:mm:ss');
		},
	},
	{
		accessorKey: 'function',
		header: 'Function',
	},
	{
		accessorKey: 'outcome',
		header: 'Status',
		cell: ({ row }) => {
			const outcome = row.getValue('outcome') as string;
			return (
				<Badge
					variant={outcome === 'success' ? 'default' : 'destructive'}
					className='capitalize'
				>
					{outcome}
				</Badge>
			);
		},
	},
];
