import { faker } from '@faker-js/faker';
import { type Contract } from '@/lib/schemas/contract';

// Helper function to generate Soroban contract ID (56 chars, starts with C)
function generateContractId() {
	return `C${faker.string.alphanumeric(55).toUpperCase()}`;
}

export const generateMockContract = (
	overrides: Partial<Contract> = {}
): Contract => {
	return {
		id: faker.string.uuid(),
		friendlyName: faker.helpers.arrayElement([
			'Token Contract',
			'Liquidity Pool',
			'NFT Marketplace',
			'Staking Contract',
			'Governance Contract',
			'DEX Contract',
			'Bridge Contract',
		]),
		contractId: generateContractId(),
		network: faker.helpers.arrayElement(['mainnet', 'testnet']),
		dateAdded: faker.date.recent({ days: 30 }),
		...overrides,
	};
};

export const generateMockContracts = (count: number): Contract[] => {
	return Array.from({ length: count }, () => generateMockContract());
};
