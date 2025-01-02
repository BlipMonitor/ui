'use client';

import * as React from 'react';
import { ProfileForm } from '@/components/settings/profile-form';
import { type ProfileSettings } from '@/lib/schemas/profile';

export default function AccountSettingsPage() {
	const handleSave = async (settings: ProfileSettings) => {
		// In a real app, this would call an API endpoint
		await new Promise((resolve) => setTimeout(resolve, 1000));
		console.log('Saving settings:', settings);
	};

	return (
		<div className='space-y-3'>
			<div>
				<h3 className='text-base font-medium'>Account Settings</h3>
				<p className='text-sm text-muted-foreground'>
					Manage your account information and password.
				</p>
			</div>

			<div className='rounded-md border p-4'>
				<ProfileForm onSave={handleSave} />
			</div>
		</div>
	);
}
