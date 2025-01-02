import { faker } from '@faker-js/faker';

export interface Alert {
	id: string;
	name: string;
	triggeredAt: Date;
	resolvedAt?: Date;
	summary: string;
	status: 'active' | 'resolved';
}

// Generate a single mock alert
export function generateMockAlert(status: Alert['status'] = 'active'): Alert {
	const triggeredAt = faker.date.recent({ days: 7 });

	return {
		id: faker.string.uuid(),
		name: faker.helpers.arrayElement([
			'High Gas Usage Alert',
			'Failure Rate Threshold',
			'Execution Time Spike',
			'Contract Call Volume Alert',
		]),
		triggeredAt,
		resolvedAt:
			status === 'resolved'
				? faker.date.between({
						from: triggeredAt,
						to: new Date(),
				  })
				: undefined,
		summary: faker.helpers.arrayElement([
			'Gas usage exceeded 500,000 in the last hour',
			'More than 5 failures detected in 10 minutes',
			'Average execution time above 2s threshold',
			'Unusual spike in contract calls detected',
		]),
		status,
	};
}

// Generate an array of mock alerts
export function generateMockAlerts(count: number = 10): Alert[] {
	return Array.from({ length: count }, (_, index) =>
		generateMockAlert(index < count / 3 ? 'active' : 'resolved')
	).sort((a, b) => b.triggeredAt.getTime() - a.triggeredAt.getTime());
}
