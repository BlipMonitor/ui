'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ChartSkeleton() {
	return (
		<Card>
			<CardHeader className='flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row'>
				<div className='grid flex-1 gap-2 text-center sm:text-left'>
					<CardTitle>
						<Skeleton className='h-5 w-32' />
					</CardTitle>
					<CardDescription>
						<Skeleton className='h-4 w-48' />
					</CardDescription>
				</div>
				<Skeleton className='h-10 w-[160px] rounded-lg sm:ml-auto' />
			</CardHeader>
			<CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
				<Skeleton className='aspect-auto h-[250px] w-full rounded-lg' />
			</CardContent>
			<CardFooter>
				<div className='flex w-full flex-col items-start gap-2'>
					<Skeleton className='h-5 w-40' />
					<Skeleton className='h-4 w-32' />
				</div>
			</CardFooter>
		</Card>
	);
}
