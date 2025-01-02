import { z } from 'zod';

// Define condition-specific schemas for better type safety
const failureThresholdSchema = z.object({
	conditionType: z.literal('failure_threshold'),
	threshold: z
		.number()
		.min(1, 'Threshold must be at least 1 failure')
		.max(100, 'Threshold must be less than 100 failures')
		.int('Threshold must be a whole number'),
});

const gasSpikeSchema = z.object({
	conditionType: z.literal('gas_spike'),
	threshold: z
		.number()
		.min(10, 'Threshold must be at least 10%')
		.max(1000, 'Threshold must be less than 1000%')
		.int('Threshold must be a whole number'),
});

const executionTimeSchema = z.object({
	conditionType: z.literal('execution_time'),
	threshold: z
		.number()
		.min(100, 'Threshold must be at least 100ms')
		.max(30000, 'Threshold must be less than 30 seconds')
		.int('Threshold must be a whole number'),
});

// Combine into a discriminated union
const conditionSchema = z.discriminatedUnion('conditionType', [
	failureThresholdSchema,
	gasSpikeSchema,
	executionTimeSchema,
]);

export const alertRuleSchema = z
	.object({
		name: z
			.string()
			.min(1, 'Rule name is required')
			.max(50, 'Rule name must be less than 50 characters')
			.regex(
				/^[a-zA-Z0-9\s-_]+$/,
				'Rule name can only contain letters, numbers, spaces, hyphens, and underscores'
			),
		contractId: z.string().min(1, 'Contract is required'),
		timeWindow: z
			.number()
			.min(1, 'Time window must be at least 1')
			.max(168, 'Time window must be less than 168 (1 week)')
			.int('Time window must be a whole number')
			.refine((val) => val > 0, 'Time window must be greater than 0'),
		timeUnit: z.enum(['minutes', 'hours', 'days'], {
			required_error: 'Please select a time unit',
		}),
		notificationChannel: z
			.enum(['slack', 'email', 'both'], {
				required_error: 'Please select a notification channel',
			})
			.default('email'),
		isActive: z.boolean().default(true),
	})
	.and(conditionSchema);

export type AlertRule = z.infer<typeof alertRuleSchema>;

// Helper types and constants for the UI
export const conditionDescriptions = {
	failure_threshold:
		'Alert when contract calls fail X times within the time window',
	gas_spike: 'Alert when gas usage exceeds X% of normal usage',
	execution_time: 'Alert when contract calls take longer than X milliseconds',
} as const;

export const thresholdUnits = {
	failure_threshold: 'failures',
	gas_spike: '% increase',
	execution_time: 'ms',
} as const;

export const defaultThresholds = {
	failure_threshold: 3,
	gas_spike: 50,
	execution_time: 1000,
} as const;
