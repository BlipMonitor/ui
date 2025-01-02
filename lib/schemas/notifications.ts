import { z } from 'zod';

const webhookSchema = z.object({
	id: z.string(),
	name: z.string().min(1, 'Webhook name is required'),
	url: z
		.string()
		.min(1, 'Slack webhook URL is required')
		.url('Must be a valid URL')
		.regex(
			/^https:\/\/hooks\.slack\.com\/services\/.*$/,
			'Must be a valid Slack webhook URL'
		),
});

export const notificationsSchema = z.object({
	webhooks: z.array(webhookSchema).default([]),
	emails: z
		.array(
			z
				.string()
				.min(1, 'Email is required')
				.email('Must be a valid email address')
		)
		.default([]),
	notifyOn: z.object({
		contractErrors: z.boolean().default(true),
		highGasUsage: z.boolean().default(true),
		longExecutionTime: z.boolean().default(true),
	}),
});

export type NotificationSettings = z.infer<typeof notificationsSchema>;
export type WebhookConfig = z.infer<typeof webhookSchema>;

export const defaultNotificationSettings: NotificationSettings = {
	webhooks: [],
	emails: [],
	notifyOn: {
		contractErrors: true,
		highGasUsage: true,
		longExecutionTime: true,
	},
};
