import { z } from 'zod';

export const contractSchema = z.object({
	id: z.string(), // Required for all contracts
	contractId: z
		.string()
		.min(1, 'Contract ID is required')
		.regex(/^C[A-Z0-9]{55}$/, 'Invalid Soroban Contract ID format'),
	friendlyName: z
		.string()
		.min(1, 'Name is required')
		.max(50, 'Name must be less than 50 characters'),
	network: z.enum(['mainnet', 'testnet'], {
		required_error: 'Please select a network',
	}),
	dateAdded: z.date().optional(),
});

export type Contract = z.infer<typeof contractSchema>;

export const defaultContract: Contract = {
	id: crypto.randomUUID(),
	contractId: '',
	friendlyName: '',
	network: 'mainnet',
};
