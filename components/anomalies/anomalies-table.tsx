'use client';

import { useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDateRangePicker } from '@/components/ui/date-range-picker';
import { Skeleton } from '@/components/ui/skeleton';

// Types for anomalies
type Severity = 'low' | 'medium' | 'high' | 'critical';
type Status = 'active' | 'resolved';

interface Anomaly {
	id: string;
	timestamp: string;
	type: string;
	description: string;
	severity: Severity;
	status: Status;
	metric?: string;
	threshold?: string;
}

// Mock data - replace with API call later
const mockAnomalies: Anomaly[] = [
	{
		id: '1',
		timestamp: '2024-01-15T10:30:00Z',
		type: 'Gas Usage Spike',
		description: 'Gas usage 250% above baseline',
		severity: 'high',
		status: 'active',
		metric: '2.5M gas',
		threshold: '1M gas',
	},
	{
		id: '2',
		timestamp: '2024-01-15T09:15:00Z',
		type: 'Error Rate Surge',
		description: 'Error rate increased to 15%',
		severity: 'critical',
		status: 'active',
		metric: '15%',
		threshold: '5%',
	},
];

const severityColors: Record<Severity, string> = {
	low: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
	medium: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
	high: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20',
	critical: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
};

export function AnomaliesTable() {
	const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
	const [selectedStatus, setSelectedStatus] = useState<string>('all');
	const [loading] = useState(false);

	const filteredAnomalies = mockAnomalies.filter((anomaly) => {
		if (selectedSeverity !== 'all' && anomaly.severity !== selectedSeverity)
			return false;
		if (selectedStatus !== 'all' && anomaly.status !== selectedStatus)
			return false;
		return true;
	});

	const handleResolve = (id: string) => {
		// TODO: Implement resolve functionality
		console.log('Resolving anomaly:', id);
	};

	if (loading) {
		return (
			<div className='space-y-4'>
				<div className='flex gap-4 mb-6'>
					<Skeleton className='h-10 w-[200px]' />
					<Skeleton className='h-10 w-[200px]' />
					<Skeleton className='h-10 w-[300px]' />
				</div>
				{[1, 2, 3].map((i) => (
					<Skeleton
						key={i}
						className='h-16 w-full'
					/>
				))}
			</div>
		);
	}

	return (
		<div className='space-y-4'>
			<div className='flex gap-4 mb-6'>
				<Select
					value={selectedSeverity}
					onValueChange={setSelectedSeverity}
				>
					<SelectTrigger className='w-[200px]'>
						<SelectValue placeholder='Filter by severity' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>All Severities</SelectItem>
						<SelectItem value='low'>Low</SelectItem>
						<SelectItem value='medium'>Medium</SelectItem>
						<SelectItem value='high'>High</SelectItem>
						<SelectItem value='critical'>Critical</SelectItem>
					</SelectContent>
				</Select>

				<Select
					value={selectedStatus}
					onValueChange={setSelectedStatus}
				>
					<SelectTrigger className='w-[200px]'>
						<SelectValue placeholder='Filter by status' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>All Status</SelectItem>
						<SelectItem value='active'>Active</SelectItem>
						<SelectItem value='resolved'>Resolved</SelectItem>
					</SelectContent>
				</Select>

				<CalendarDateRangePicker />
			</div>

			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Time</TableHead>
							<TableHead>Type</TableHead>
							<TableHead>Description</TableHead>
							<TableHead>Severity</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className='text-right'>
								Actions
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredAnomalies.map((anomaly) => (
							<TableRow key={anomaly.id}>
								<TableCell className='font-mono'>
									{new Intl.DateTimeFormat('en-US', {
										year: 'numeric',
										month: 'numeric',
										day: 'numeric',
										hour: 'numeric',
										minute: 'numeric',
										second: 'numeric',
										hour12: true,
									}).format(new Date(anomaly.timestamp))}
								</TableCell>
								<TableCell>{anomaly.type}</TableCell>
								<TableCell>{anomaly.description}</TableCell>
								<TableCell>
									<Badge
										variant='secondary'
										className={
											severityColors[anomaly.severity]
										}
									>
										{anomaly.severity}
									</Badge>
								</TableCell>
								<TableCell>
									<Badge
										variant='secondary'
										className={
											anomaly.status === 'active'
												? 'bg-blue-500/10 text-blue-500'
												: 'bg-gray-500/10 text-gray-500'
										}
									>
										{anomaly.status}
									</Badge>
								</TableCell>
								<TableCell className='text-right'>
									{anomaly.status === 'active' && (
										<Button
											variant='outline'
											size='sm'
											onClick={() =>
												handleResolve(anomaly.id)
											}
										>
											Resolve
										</Button>
									)}
								</TableCell>
							</TableRow>
						))}
						{filteredAnomalies.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={6}
									className='h-24 text-center text-muted-foreground'
								>
									No anomalies found
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
