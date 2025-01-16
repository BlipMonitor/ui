import { faker } from '@faker-js/faker';
import {
	type Anomaly,
	type Severity,
	type Status,
} from '@/app/dashboard/anomalies/columns';

const anomalyTypes = [
	'Gas Usage Spike',
	'Error Rate Surge',
	'Execution Time Spike',
	'Failed Transaction Surge',
	'High Memory Usage',
	'Unusual Call Pattern',
	'Repeated Function Calls',
	'Large Transfer Amount',
];

const thresholdDescriptions = {
	'Gas Usage Spike': {
		metric: () => `${faker.number.int({ min: 2, max: 5 })}M gas`,
		threshold: () => `${faker.number.int({ min: 1, max: 2 })}M gas`,
		description: (metric: string, threshold: string) =>
			`Gas usage ${metric} exceeds baseline ${threshold}`,
	},
	'Error Rate Surge': {
		metric: () => `${faker.number.int({ min: 10, max: 30 })}%`,
		threshold: () => `${faker.number.int({ min: 1, max: 5 })}%`,
		description: (metric: string, threshold: string) =>
			`Error rate increased to ${metric} (threshold: ${threshold})`,
	},
	'Execution Time Spike': {
		metric: () => `${faker.number.int({ min: 500, max: 2000 })}ms`,
		threshold: () => `${faker.number.int({ min: 100, max: 300 })}ms`,
		description: (metric: string, threshold: string) =>
			`Average execution time ${metric} above normal ${threshold}`,
	},
	'Failed Transaction Surge': {
		metric: () => `${faker.number.int({ min: 5, max: 15 })} failures`,
		threshold: () => `${faker.number.int({ min: 1, max: 3 })} failures`,
		description: (metric: string, threshold: string) =>
			`${metric} in last hour (threshold: ${threshold})`,
	},
	'High Memory Usage': {
		metric: () => `${faker.number.int({ min: 80, max: 95 })}%`,
		threshold: () => `${faker.number.int({ min: 60, max: 75 })}%`,
		description: (metric: string, threshold: string) =>
			`Memory usage at ${metric} (threshold: ${threshold})`,
	},
	'Unusual Call Pattern': {
		metric: () => `${faker.number.int({ min: 50, max: 200 })} calls`,
		threshold: () => `${faker.number.int({ min: 20, max: 40 })} calls`,
		description: (metric: string, threshold: string) =>
			`${metric} in 5 minutes (normal: ${threshold})`,
	},
	'Repeated Function Calls': {
		metric: () => `${faker.number.int({ min: 20, max: 50 })} calls`,
		threshold: () => `${faker.number.int({ min: 5, max: 10 })} calls`,
		description: (metric: string, threshold: string) =>
			`Function called ${metric} (normal: ${threshold})`,
	},
	'Large Transfer Amount': {
		metric: () => `${faker.number.int({ min: 100000, max: 1000000 })} XLM`,
		threshold: () => `${faker.number.int({ min: 10000, max: 50000 })} XLM`,
		description: (metric: string, threshold: string) =>
			`Transfer amount ${metric} exceeds typical ${threshold}`,
	},
};

export const generateMockAnomaly = (
	overrides: Partial<Anomaly> = {}
): Anomaly => {
	const type = overrides.type || faker.helpers.arrayElement(anomalyTypes);
	const thresholdInfo =
		thresholdDescriptions[type as keyof typeof thresholdDescriptions];
	const metric = thresholdInfo.metric();
	const threshold = thresholdInfo.threshold();

	const baseAnomaly: Anomaly = {
		id: faker.string.uuid(),
		timestamp: faker.date.recent({ days: 7 }),
		type,
		description: thresholdInfo.description(metric, threshold),
		severity: faker.helpers.arrayElement([
			'low',
			'medium',
			'high',
			'critical',
		] as Severity[]),
		status: faker.helpers.arrayElement(['active', 'resolved'] as Status[]),
		metric,
		threshold,
	};

	return {
		...baseAnomaly,
		...overrides,
	};
};

export const generateMockAnomalies = (
	count: number,
	options: {
		timeRange?: { start: Date; end: Date };
		severity?: Severity;
		status?: Status;
	} = {}
): Anomaly[] => {
	const anomalies: Anomaly[] = [];
	const { timeRange, severity, status } = options;

	// Calculate time step between anomalies
	const end = timeRange?.end || new Date();
	const start =
		timeRange?.start || new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
	const timeStep = (end.getTime() - start.getTime()) / count;

	for (let i = 0; i < count; i++) {
		const timestamp = new Date(start.getTime() + i * timeStep);
		const overrides: Partial<Anomaly> = {
			timestamp,
		};

		// Only add defined options to overrides
		if (severity) overrides.severity = severity;
		if (status) overrides.status = status;

		anomalies.push(generateMockAnomaly(overrides));
	}

	return anomalies;
};
