import { faker } from '@faker-js/faker';

export type EventStatus = 'success' | 'failure' | 'pending';
export type EventType = 'invoke' | 'deploy' | 'upgrade' | 'admin';

export interface ContractEvent {
	id: string;
	contractId: string;
	network: string;
	timestamp: Date;
	type: EventType;
	status: EventStatus;
	functionName?: string;
	arguments?: string[];
	gasUsed?: number;
	executionTime?: number;
	error?: string;
	transactionHash: string;
}

const functionNames = [
	'transfer',
	'mint',
	'burn',
	'swap',
	'addLiquidity',
	'removeLiquidity',
	'stake',
	'unstake',
	'vote',
	'propose',
	'execute',
];

const errorMessages = [
	'Insufficient balance',
	'Invalid arguments',
	'Unauthorized access',
	'Operation not allowed',
	'Contract paused',
	'Deadline expired',
	'Slippage too high',
	'Rate limit exceeded',
	'Invalid signature',
	'Contract not found',
];

export const generateMockEvent = (
	overrides: Partial<ContractEvent> = {}
): ContractEvent => {
	const type =
		overrides.type ||
		faker.helpers.arrayElement([
			'invoke',
			'deploy',
			'upgrade',
			'admin',
		] as EventType[]);
	const status =
		overrides.status ||
		faker.helpers.arrayElement([
			'success',
			'failure',
			'pending',
		] as EventStatus[]);

	const baseEvent: ContractEvent = {
		id: faker.string.uuid(),
		contractId: faker.string.hexadecimal({ length: 56, prefix: '' }),
		network: faker.helpers.arrayElement([
			'mainnet',
			'testnet',
			'futurenet',
		]),
		timestamp: faker.date.recent({ days: 7 }),
		type,
		status,
		transactionHash: faker.string.hexadecimal({ length: 64, prefix: '' }),
		functionName:
			type === 'invoke'
				? faker.helpers.arrayElement(functionNames)
				: type,
		gasUsed:
			status === 'pending'
				? faker.number.int({ min: 500000, max: 1000000 })
				: faker.number.int({ min: 800000, max: 2000000 }),
		executionTime:
			status === 'pending'
				? undefined
				: faker.number.int({ min: 100, max: 1000 }),
	};

	if (type === 'invoke') {
		baseEvent.arguments = Array.from(
			{ length: faker.number.int({ min: 1, max: 4 }) },
			() => faker.string.alphanumeric(8)
		);
	}

	if (status === 'failure') {
		baseEvent.error = faker.helpers.arrayElement(errorMessages);
	}

	return {
		...baseEvent,
		...overrides,
	};
};

export const generateMockEvents = (
	count: number,
	options: {
		contractId?: string;
		timeRange?: { start: Date; end: Date };
		type?: EventType;
		status?: EventStatus;
	} = {}
): ContractEvent[] => {
	const events: ContractEvent[] = [];
	const { contractId, timeRange, type, status } = options;

	// Calculate time step between events
	const end = timeRange?.end || new Date();
	const start =
		timeRange?.start || new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
	const timeStep = (end.getTime() - start.getTime()) / count;

	for (let i = 0; i < count; i++) {
		const timestamp = new Date(start.getTime() + i * timeStep);
		const overrides: Partial<ContractEvent> = {
			timestamp,
		};

		// Only add defined options to overrides
		if (contractId) overrides.contractId = contractId;
		if (type) overrides.type = type;
		if (status) overrides.status = status;

		events.push(generateMockEvent(overrides));
	}

	return events;
};
