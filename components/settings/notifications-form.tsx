'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import {
	type NotificationSettings,
	notificationsSchema,
	defaultNotificationSettings,
} from '@/lib/schemas/notifications';
import {
	Form,
	FormControl,
	FormDescription,
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
	const [isTesting, setIsTesting] = React.useState(false);
	const [isSaving, setIsSaving] = React.useState(false);
	const { toast } = useToast();

	const form = useForm<NotificationSettings>({
		resolver: zodResolver(notificationsSchema),
		defaultValues,
	});

	const handleTestWebhook = async () => {
		const webhook = form.getValues('slackWebhook');
		if (!webhook) {
			form.setError('slackWebhook', {
				type: 'manual',
				message: 'Please enter a webhook URL first',
			});
			return;
		}

		setIsTesting(true);
		try {
			// In a real app, this would call an API endpoint
			await new Promise((resolve) => setTimeout(resolve, 1000));
			toast({
				title: 'Test Successful',
				description: 'Slack webhook is working correctly.',
			});
		} catch {
			toast({
				title: 'Test Failed',
				description:
					'Could not connect to Slack. Please check the URL.',
				variant: 'destructive',
			});
		} finally {
			setIsTesting(false);
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
				<FormField
					control={form.control}
					name='slackWebhook'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Slack Webhook URL</FormLabel>
							<div className='flex gap-2'>
								<FormControl>
									<Input
										placeholder='https://hooks.slack.com/services/...'
										{...field}
									/>
								</FormControl>
								<Button
									type='button'
									variant='outline'
									onClick={handleTestWebhook}
									disabled={isTesting}
								>
									{isTesting && (
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									)}
									Test
								</Button>
							</div>
							<FormDescription>
								Your Slack webhook URL for receiving
								notifications. Create one in your Slack
								workspace settings.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email Address</FormLabel>
							<FormControl>
								<Input
									type='email'
									placeholder='alerts@example.com'
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Email address for receiving alert notifications.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

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
