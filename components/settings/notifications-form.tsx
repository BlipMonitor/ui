'use client';

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import {
	type NotificationSettings,
	type WebhookConfig,
	notificationsSchema,
	defaultNotificationSettings,
} from '@/lib/schemas/notifications';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface NotificationsFormProps {
	defaultValues?: NotificationSettings;
	onSave: (settings: NotificationSettings) => Promise<void>;
}

export function NotificationsForm({
	defaultValues = defaultNotificationSettings,
	onSave,
}: NotificationsFormProps) {
	const [testingWebhook, setTestingWebhook] = React.useState<string | null>(
		null
	);
	const [testingEmail, setTestingEmail] = React.useState<string | null>(null);
	const [isSaving, setIsSaving] = React.useState(false);
	const { toast } = useToast();

	const form = useForm<NotificationSettings>({
		resolver: zodResolver(notificationsSchema),
		defaultValues,
	});

	const webhooksArray = useFieldArray({
		control: form.control,
		name: 'webhooks',
	});

	const emailsArray = useFieldArray({
		control: form.control,
		name: 'emails',
	});

	const handleTestWebhook = async (webhook: WebhookConfig, index: number) => {
		if (!webhook.url) {
			form.setError(`webhooks.${index}.url` as const, {
				type: 'manual',
				message: 'Please enter a webhook URL first',
			});
			return;
		}

		setTestingWebhook(webhook.id);
		try {
			// In a real app, this would call an API endpoint
			await new Promise((resolve) => setTimeout(resolve, 1000));
			toast({
				title: 'Test Successful',
				description: `${webhook.name} webhook is working correctly.`,
			});
		} catch {
			toast({
				title: 'Test Failed',
				description:
					'Could not connect to Slack. Please check the URL.',
				variant: 'destructive',
			});
		} finally {
			setTestingWebhook(null);
		}
	};

	const handleTestEmail = async (email: string, index: number) => {
		if (!email) {
			form.setError(`emails.${index}` as const, {
				type: 'manual',
				message: 'Please enter an email address first',
			});
			return;
		}

		setTestingEmail(email);
		try {
			// In a real app, this would call an API endpoint
			await new Promise((resolve) => setTimeout(resolve, 1000));
			toast({
				title: 'Test Successful',
				description: `Test email sent to ${email}.`,
			});
		} catch {
			toast({
				title: 'Test Failed',
				description:
					'Could not send test email. Please check the address.',
				variant: 'destructive',
			});
		} finally {
			setTestingEmail(null);
		}
	};

	const onSubmit = async (data: NotificationSettings) => {
		setIsSaving(true);
		try {
			await onSave(data);
			toast({
				title: 'Settings Saved',
				description: 'Your notification settings have been updated.',
			});
		} catch {
			toast({
				title: 'Error',
				description: 'Could not save settings. Please try again.',
				variant: 'destructive',
			});
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-6'
			>
				<div className='space-y-4'>
					<div className='flex items-center justify-between'>
						<h4 className='text-sm font-medium'>Slack Webhooks</h4>
						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={() =>
								webhooksArray.append({
									id: crypto.randomUUID(),
									name: '',
									url: '',
								})
							}
						>
							<Plus className='mr-2 h-4 w-4' />
							Add Webhook
						</Button>
					</div>
					<div className='space-y-4'>
						{webhooksArray.fields.map((field, index) => (
							<div
								key={field.id}
								className='flex gap-4'
							>
								<FormField
									control={form.control}
									name={`webhooks.${index}.name`}
									render={({ field }) => (
										<FormItem className='flex-1'>
											<FormControl>
												<Input
													placeholder='Webhook name'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={`webhooks.${index}.url`}
									render={({ field }) => (
										<FormItem className='flex-[2]'>
											<FormControl>
												<Input
													placeholder='https://hooks.slack.com/services/...'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className='flex gap-2'>
									<Button
										type='button'
										variant='outline'
										size='icon'
										onClick={() =>
											handleTestWebhook(
												webhooksArray.fields[index],
												index
											)
										}
										disabled={!!testingWebhook}
									>
										{testingWebhook === field.id ? (
											<Loader2 className='h-4 w-4 animate-spin' />
										) : (
											'Test'
										)}
									</Button>
									<Button
										type='button'
										variant='outline'
										size='icon'
										onClick={() =>
											webhooksArray.remove(index)
										}
									>
										<Trash2 className='h-4 w-4' />
									</Button>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className='space-y-4'>
					<div className='flex items-center justify-between'>
						<h4 className='text-sm font-medium'>Email Addresses</h4>
						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={() => emailsArray.append('')}
						>
							<Plus className='mr-2 h-4 w-4' />
							Add Email
						</Button>
					</div>
					<div className='space-y-4'>
						{emailsArray.fields.map((field, index) => (
							<div
								key={field.id}
								className='flex gap-4'
							>
								<FormField
									control={form.control}
									name={`emails.${index}`}
									render={({ field }) => (
										<FormItem className='flex-1'>
											<FormControl>
												<Input
													type='email'
													placeholder='alerts@example.com'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className='flex gap-2'>
									<Button
										type='button'
										variant='outline'
										size='icon'
										onClick={() =>
											handleTestEmail(
												form.getValues(
													`emails.${index}`
												),
												index
											)
										}
										disabled={!!testingEmail}
									>
										{testingEmail ===
										form.getValues(`emails.${index}`) ? (
											<Loader2 className='h-4 w-4 animate-spin' />
										) : (
											'Test'
										)}
									</Button>
									<Button
										type='button'
										variant='outline'
										size='icon'
										onClick={() =>
											emailsArray.remove(index)
										}
									>
										<Trash2 className='h-4 w-4' />
									</Button>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className='space-y-4'>
					<h4 className='text-sm font-medium'>Notify me about:</h4>
					<div className='space-y-2'>
						<FormField
							control={form.control}
							name='notifyOn.contractErrors'
							render={({ field }) => (
								<FormItem className='flex items-center space-x-2'>
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<FormLabel className='!mt-0'>
										Contract errors and failures
									</FormLabel>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='notifyOn.highGasUsage'
							render={({ field }) => (
								<FormItem className='flex items-center space-x-2'>
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<FormLabel className='!mt-0'>
										High gas usage alerts
									</FormLabel>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='notifyOn.longExecutionTime'
							render={({ field }) => (
								<FormItem className='flex items-center space-x-2'>
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<FormLabel className='!mt-0'>
										Long execution time warnings
									</FormLabel>
								</FormItem>
							)}
						/>
					</div>
				</div>

				<Button
					type='submit'
					disabled={isSaving}
				>
					{isSaving && (
						<Loader2 className='mr-2 h-4 w-4 animate-spin' />
					)}
					Save Changes
				</Button>
			</form>
		</Form>
	);
}
