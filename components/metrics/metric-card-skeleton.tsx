import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function MetricCardSkeleton() {
	return (
		<Card className='h-full'>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
				<Skeleton className='h-4 w-4' />
				<Skeleton className='h-4 w-14' />
			</CardHeader>
			<CardContent className='space-y-1'>
				<Skeleton className='h-8 w-20' />
				<Skeleton className='h-3 w-24' />
				<Skeleton className='h-3 w-32' />
			</CardContent>
		</Card>
	);
}
