import { format } from 'date-fns';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/lib/mock/alerts';
import { Skeleton } from '@/components/ui/skeleton';

interface AlertsTableProps {
	alerts: Alert[];
	isLoading?: boolean;
}

export function AlertsTable({ alerts, isLoading }: AlertsTableProps) {
	if (isLoading) {
		return <AlertsTableSkeleton />;
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Triggered</TableHead>
					<TableHead>Resolved</TableHead>
					<TableHead>Summary</TableHead>
					<TableHead>Status</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{alerts.map((alert) => (
					<TableRow key={alert.id}>
						<TableCell className='font-medium'>
							{alert.name}
						</TableCell>
						<TableCell>
							{format(alert.triggeredAt, 'MMM d, yyyy HH:mm')}
						</TableCell>
						<TableCell>
							{alert.resolvedAt
								? format(alert.resolvedAt, 'MMM d, yyyy HH:mm')
								: '-'}
						</TableCell>
						<TableCell className='max-w-md truncate'>
							{alert.summary}
						</TableCell>
						<TableCell>
							<Badge
								variant={
									alert.status === 'active'
										? 'destructive'
										: 'secondary'
								}
							>
								{alert.status}
							</Badge>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

function AlertsTableSkeleton() {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Triggered</TableHead>
					<TableHead>Resolved</TableHead>
					<TableHead>Summary</TableHead>
					<TableHead>Status</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{Array.from({ length: 5 }).map((_, index) => (
					<TableRow key={index}>
						<TableCell>
							<Skeleton className='h-4 w-[150px]' />
						</TableCell>
						<TableCell>
							<Skeleton className='h-4 w-[120px]' />
						</TableCell>
						<TableCell>
							<Skeleton className='h-4 w-[120px]' />
						</TableCell>
						<TableCell>
							<Skeleton className='h-4 w-[200px]' />
						</TableCell>
						<TableCell>
							<Skeleton className='h-4 w-[80px]' />
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
