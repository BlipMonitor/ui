import { faker } from '@faker-js/faker';

export interface PerformanceMetric {
	timestamp: Date;
	gasUsed: number;
	executionTime: number; // in milliseconds
	memoryUsage: number; // in bytes
	contractId: string;
	network: string;
	transactionHash: string;
}

// Helper to generate realistic time series data with some patterns
function generateTimeSeriesValue(
	baseValue: number,
	variance: number,
	trendFactor: number = 0
): number {
	// Add random noise
	const noise = faker.number.int({ min: -variance, max: variance });
	// Add slight trend
	const trend = trendFactor * faker.number.int({ min: -10, max: 10 });
	return Math.max(0, baseValue + noise + trend);
}

export const generateMockPerformanceMetric = (
	overrides: Partial<PerformanceMetric> = {}
): PerformanceMetric => {
	const baseGasUsage = 1000000; // 1M gas as base
	const baseExecutionTime = 200; // 200ms as base
	const baseMemoryUsage = 1024 * 1024; // 1MB as base

	return {
		timestamp: faker.date.recent({ days: 7 }),
		gasUsed: generateTimeSeriesValue(baseGasUsage, 200000),
		executionTime: generateTimeSeriesValue(baseExecutionTime, 50),
		memoryUsage: generateTimeSeriesValue(baseMemoryUsage, 102400),
		contractId: faker.string.hexadecimal({ length: 56, prefix: '' }),
		network: faker.helpers.arrayElement([
			'mainnet',
			'testnet',
			'futurenet',
		]),
		transactionHash: faker.string.hexadecimal({ length: 64, prefix: '' }),
		...overrides,
	};
};

export const generateMockPerformanceMetrics = (
	count: number,
	options: {
		contractId?: string;
		timeRange?: { start: Date; end: Date };
		pattern?: 'normal' | 'spike' | 'degrading';
	} = {}
): PerformanceMetric[] => {
	const metrics: PerformanceMetric[] = [];
	const { contractId, timeRange, pattern = 'normal' } = options;

	// Calculate time step between data points
	const end = timeRange?.end || new Date();
	const start =
		timeRange?.start || new Date(end.getTime() - 90 * 24 * 60 * 60 * 1000); // Default to 90 days
	const timeStep = (end.getTime() - start.getTime()) / count;

	// Base values for metrics
	let baseGasUsage = 1000000;
	let baseExecutionTime = 200;
	let baseMemoryUsage = 1024 * 1024;

	for (let i = 0; i < count; i++) {
		const timestamp = new Date(start.getTime() + i * timeStep);

		// Adjust base values based on pattern
		switch (pattern) {
			case 'spike':
				// Create occasional spikes
				if (i % 10 === 0) {
					baseGasUsage *= 2;
					baseExecutionTime *= 1.5;
				} else {
					baseGasUsage = 1000000;
					baseExecutionTime = 200;
				}
				break;
			case 'degrading':
				// Gradually increase values
				baseGasUsage *= 1.01;
				baseExecutionTime *= 1.01;
				baseMemoryUsage *= 1.005;
				break;
		}

		metrics.push(
			generateMockPerformanceMetric({
				timestamp,
				contractId,
				gasUsed: generateTimeSeriesValue(baseGasUsage, 200000),
				executionTime: generateTimeSeriesValue(baseExecutionTime, 50),
				memoryUsage: generateTimeSeriesValue(baseMemoryUsage, 102400),
			})
		);
	}

	return metrics;
};
