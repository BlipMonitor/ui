'use client';

import { Activity } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { generateMockAnomalies } from '@/lib/mock/anomalies';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export function ActiveAnomaliesBanner() {
	const [anomalyCounts, setAnomalyCounts] = useState({
		critical: 0,
		high: 0,
		total: 0,
	});

	useEffect(() => {
		// Generate mock anomalies and count by severity
		const mockAnomalies = generateMockAnomalies(20);
		const activeAnomalies = mockAnomalies.filter(
			(a) => a.status === 'active'
		);

		setAnomalyCounts({
			critical: activeAnomalies.filter((a) => a.severity === 'critical')
				.length,
			high: activeAnomalies.filter((a) => a.severity === 'high').length,
			total: activeAnomalies.length,
		});
	}, []);

	if (anomalyCounts.total === 0) return null;

	return (
		<Link
			href='/dashboard/anomalies'
			className='block hover:opacity-[0.98]'
		>
			<Alert
				variant='destructive'
				className='cursor-pointer bg-red-500/90 text-white'
			>
				<Activity className='h-4 w-4' />
				<AlertDescription className='flex items-center justify-between'>
					<span>
						{anomalyCounts.critical > 0 && (
							<>
								<Badge
									variant='outline'
									className='bg-white/20 text-white border-white/40 mr-2'
								>
									{anomalyCounts.critical} Critical
								</Badge>
							</>
						)}
						{anomalyCounts.high > 0 && (
							<>
								<Badge
									variant='outline'
									className='bg-white/20 text-white border-white/40 mr-2'
								>
									{anomalyCounts.high} High
								</Badge>
							</>
						)}
						{anomalyCounts.total} active{' '}
						{anomalyCounts.total === 1 ? 'anomaly' : 'anomalies'}{' '}
						detected
					</span>
					<Button
						variant='outline'
						size='sm'
						className='bg-white/10 text-white hover:bg-white/20 border-white/40'
					>
						View All
					</Button>
				</AlertDescription>
			</Alert>
		</Link>
	);
}
