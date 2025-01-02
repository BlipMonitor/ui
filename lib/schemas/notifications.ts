import { z } from 'zod';

export const notificationsSchema = z.object({
	slackWebhook: z
		.string()
		.min(1, 'Slack webhook URL is required')
		.url('Must be a valid URL')
		.regex(
			/^https:\/\/hooks\.slack\.com\/services\/.*$/,
			'Must be a valid Slack webhook URL'
		),
	email: z
		.string()
		.min(1, 'Email is required')
		.email('Must be a valid email address'),
	notifyOn: z.object({
		contractErrors: z.boolean().default(true),
		highGasUsage: z.boolean().default(true),
		longExecutionTime: z.boolean().default(true),
	}),
});

export type NotificationSettings = z.infer<typeof notificationsSchema>;

export const defaultNotificationSettings: NotificationSettings = {
	slackWebhook: '',
	email: '',
	notifyOn: {
		contractErrors: true,
		highGasUsage: true,
		longExecutionTime: true,
	},
};
