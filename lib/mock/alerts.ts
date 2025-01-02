import { faker } from '@faker-js/faker';

export type AlertStatus = 'active' | 'resolved';

export interface Alert {
	id: string;
	name: string;
	triggeredAt: Date;
	resolvedAt: Date | null;
	summary: string;
	status: AlertStatus;
	contractAddress: string;
	network: string;
	severity: 'low' | 'medium' | 'high' | 'critical';
}

const networks = ['mainnet', 'testnet', 'futurenet'];
const severities = ['low', 'medium', 'high', 'critical'] as const;

const alertTypes = [
	'Contract Invocation Failed',
	'High Gas Usage',
	'Unusual Transaction Volume',
	'Contract Balance Low',
	'Failed Authentication',
	'Rate Limit Exceeded',
	'Memory Usage High',
	'Storage Limit Warning',
	'Network Latency',
	'Contract State Change',
];

const generateAlertSummary = (
	type: string,
	contractAddress: string,
	network: string
): string => {
	switch (type) {
		case 'Contract Invocation Failed':
			return `Failed to invoke method "${faker.word.sample()}" on contract ${contractAddress} (${network})`;
		case 'High Gas Usage':
			return `Gas usage exceeded threshold (${faker.number.int({
				min: 80,
				max: 95,
			})}%) for contract ${contractAddress}`;
		case 'Unusual Transaction Volume':
			return `Detected ${faker.number.int({
				min: 50,
				max: 200,
			})}% increase in transaction volume for contract ${contractAddress}`;
		case 'Contract Balance Low':
			return `Contract balance below ${faker.number.int({
				min: 1000,
				max: 10000,
			})} XLM threshold`;
		case 'Failed Authentication':
			return `Multiple failed authentication attempts detected from ${faker.internet.ip()}`;
		case 'Rate Limit Exceeded':
			return `API rate limit exceeded for contract ${contractAddress}`;
		case 'Memory Usage High':
			return `Memory usage at ${faker.number.int({
				min: 85,
				max: 98,
			})}% of allocated limit`;
		case 'Storage Limit Warning':
			return `Storage usage approaching limit (${faker.number.int({
				min: 75,
				max: 90,
			})}% used)`;
		case 'Network Latency':
			return `High network latency detected (${faker.number.int({
				min: 2000,
				max: 5000,
			})}ms)`;
		case 'Contract State Change':
			return `Unexpected state change detected in contract ${contractAddress}`;
		default:
			return `Alert triggered for contract ${contractAddress}`;
	}
};

export const generateMockAlert = (overrides: Partial<Alert> = {}): Alert => {
	const triggeredAt = faker.date.recent({ days: 7 });
	const status = faker.helpers.arrayElement([
		'active',
		'resolved',
	] as AlertStatus[]);
	const network = faker.helpers.arrayElement(networks);
	const contractAddress = faker.string.hexadecimal({
		length: 56,
		prefix: '',
	});
	const alertType = faker.helpers.arrayElement(alertTypes);

	return {
		id: faker.string.uuid(),
		name: alertType,
		triggeredAt,
		resolvedAt:
			status === 'resolved'
				? faker.date.between({ from: triggeredAt, to: new Date() })
				: null,
		summary: generateAlertSummary(alertType, contractAddress, network),
		status,
		contractAddress,
		network,
		severity: faker.helpers.arrayElement(severities),
		...overrides,
	};
};

export const generateMockAlerts = (count: number): Alert[] => {
	return Array.from({ length: count }, () => generateMockAlert());
};
