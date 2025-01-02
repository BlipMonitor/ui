import { z } from 'zod';

export const alertRuleSchema = z.object({
	name: z
		.string()
		.min(1, 'Rule name is required')
		.max(50, 'Rule name must be less than 50 characters')
		.regex(
			/^[a-zA-Z0-9\s-_]+$/,
			'Rule name can only contain letters, numbers, spaces, hyphens, and underscores'
		),
	contractId: z.string().min(1, 'Contract is required'),
	conditionType: z.enum(
		['failure_threshold', 'gas_spike', 'execution_time'],
		{
			required_error: 'Please select a condition type',
		}
	),
	threshold: z
		.number()
		.min(1, 'Threshold must be at least 1')
		.max(1000, 'Threshold must be less than 1000')
		.int('Threshold must be a whole number')
		.refine((val) => val > 0, 'Threshold must be greater than 0'),
	timeWindow: z
		.number()
		.min(1, 'Time window must be at least 1')
		.max(168, 'Time window must be less than 168 (1 week)')
		.int('Time window must be a whole number')
		.refine((val) => val > 0, 'Time window must be greater than 0'),
	timeUnit: z.enum(['minutes', 'hours', 'days'], {
		required_error: 'Please select a time unit',
	}),
	notificationChannel: z.enum(['slack', 'email', 'both'], {
		required_error: 'Please select a notification channel',
	}),
	isActive: z.boolean().default(true),
});

export type AlertRule = z.infer<typeof alertRuleSchema>;
