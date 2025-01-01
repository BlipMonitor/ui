'use client';

import { MetricCard } from '@/components/metrics/metric-card';
import { Activity, AlertTriangle, BarChart3, CheckCircle2 } from 'lucide-react';

export function Metrics() {
	return (
		<>
			<MetricCard
				title='Success Rate'
				value='98.5%'
				icon={CheckCircle2}
				trend={{ value: 2.1, isPositive: true }}
				description='Last 24 hours'
				href='/dashboard/performance'
			/>
			<MetricCard
				title='Failures'
				value='12'
				icon={AlertTriangle}
				trend={{ value: 4.5, isPositive: false }}
				description='Last 24 hours'
				href='/dashboard/activity'
			/>
			<MetricCard
				title='Average Gas Usage'
				value='1.2M'
				icon={BarChart3}
				trend={{ value: -1.8, isPositive: true }}
				description='Last 24 hours'
				href='/dashboard/performance'
			/>
			<MetricCard
				title='Active Alerts'
				value='2'
				icon={Activity}
				trend={{ value: 100, isPositive: false }}
				description='Last 24 hours'
				href='/dashboard/alerts'
			/>
		</>
	);
}
