import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function RecentEventsSkeleton() {
	return (
		<div className='space-y-4'>
			<div className='flex justify-between items-center'>
				<h2 className='text-lg font-medium'>Recent Events</h2>
				<Button
					variant='outline'
					disabled
					className='gap-2'
				>
					View All
					<ArrowRight className='h-4 w-4' />
				</Button>
			</div>
			<div className='border rounded-md'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Date & Time</TableHead>
							<TableHead>Function</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Gas Used</TableHead>
							<TableHead>Execution Time</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{Array.from({ length: 5 }).map((_, i) => (
							<TableRow key={i}>
								<TableCell>
									<Skeleton className='h-4 w-24' />
								</TableCell>
								<TableCell>
									<Skeleton className='h-4 w-20' />
								</TableCell>
								<TableCell>
									<Skeleton className='h-6 w-16 rounded-full' />
								</TableCell>
								<TableCell>
									<Skeleton className='h-4 w-16' />
								</TableCell>
								<TableCell>
									<Skeleton className='h-4 w-12' />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
