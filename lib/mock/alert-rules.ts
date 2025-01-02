'use client';

import { AlertRule } from '@/lib/schemas/alert-rule';
import { faker } from '@faker-js/faker';

// Helper function to generate Soroban contract ID (32 chars, starts with C)
function generateContractId() {
	return 'C' + faker.string.alphanumeric({ length: 31, casing: 'upper' });
}

// Generate a few fixed contract IDs to reuse (simulating real contracts)
const contractIds = Array.from({ length: 3 }, generateContractId);

function generateMockRule(): AlertRule & { id: string } {
	const conditionTypes = [
		'gas_spike',
		'failure_threshold',
		'execution_time',
	] as const;
	const timeUnits = ['minutes', 'hours', 'days'] as const;
	const notificationChannels = ['slack', 'email', 'both'] as const;

	const conditionType = faker.helpers.arrayElement(conditionTypes);

	// Generate threshold based on condition type
	const threshold = (() => {
		switch (conditionType) {
			case 'gas_spike':
				return faker.number.int({ min: 20, max: 200 }); // 20% to 200%
			case 'failure_threshold':
				return faker.number.int({ min: 1, max: 10 }); // 1 to 10 failures
			case 'execution_time':
				return faker.number.int({ min: 500, max: 5000 }); // 500ms to 5000ms
		}
	})();

	// Generate time window based on unit
	const timeUnit = faker.helpers.arrayElement(timeUnits);
	const timeWindow = (() => {
		switch (timeUnit) {
			case 'minutes':
				return faker.number.int({ min: 5, max: 30 });
			case 'hours':
				return faker.number.int({ min: 1, max: 24 });
			case 'days':
				return faker.number.int({ min: 1, max: 7 });
		}
	})();

	return {
		id: `rule-${faker.string.nanoid(6)}`,
		name:
			faker.helpers.arrayElement([
				'Gas Usage Monitor',
				'Failure Detection',
				'Performance Alert',
				'Execution Time Check',
				'Transaction Monitor',
				'Error Rate Alert',
			]) +
			' ' +
			faker.string.alphanumeric(4).toUpperCase(),
		conditionType,
		threshold,
		timeWindow,
		timeUnit,
		notificationChannel: faker.helpers.arrayElement(notificationChannels),
		isActive: faker.datatype.boolean(),
		contractId: faker.helpers.arrayElement(contractIds),
	};
}

export function generateMockRules(
	count: number = 5
): (AlertRule & { id: string })[] {
	return Array.from({ length: count }, generateMockRule);
}
