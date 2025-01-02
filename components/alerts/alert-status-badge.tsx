import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AlertStatusBadgeProps {
	status: 'critical' | 'warning' | 'info';
	className?: string;
}

export function AlertStatusBadge({ status, className }: AlertStatusBadgeProps) {
	return (
		<Badge
			variant='secondary'
			className={cn(
				'capitalize',
				{
					'bg-destructive/15 text-destructive hover:bg-destructive/20':
						status === 'critical',
					'bg-warning/15 text-warning hover:bg-warning/20':
						status === 'warning',
					'bg-info/15 text-info hover:bg-info/20': status === 'info',
				},
				className
			)}
		>
			{status}
		</Badge>
	);
}
