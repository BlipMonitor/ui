'use client';

import * as React from 'react';
import { NotificationsForm } from '@/components/settings/notifications-form';
import { type NotificationSettings } from '@/lib/schemas/notifications';

export default function NotificationsSettingsPage() {
	const handleSave = async (settings: NotificationSettings) => {
		// In a real app, this would call an API endpoint
		await new Promise((resolve) => setTimeout(resolve, 1000));
		console.log('Saving settings:', settings);
	};

	return (
		<div className='space-y-3'>
			<div>
				<h3 className='text-base font-medium'>Notification Settings</h3>
				<p className='text-sm text-muted-foreground'>
					Configure how you want to be notified about important
					events.
				</p>
			</div>

			<div className='rounded-md border p-4'>
				<NotificationsForm onSave={handleSave} />
			</div>
		</div>
	);
}
