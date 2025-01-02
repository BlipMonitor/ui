'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import {
	type ProfileSettings,
	profileSchema,
	defaultProfileSettings,
} from '@/lib/schemas/profile';
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
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface ProfileFormProps {
	defaultValues?: ProfileSettings;
	onSave: (settings: ProfileSettings) => Promise<void>;
}

function calculatePasswordStrength(password: string): number {
	if (!password) return 0;
	let strength = 0;

	// Length check
	if (password.length >= 8) strength += 25;

	// Contains number
	if (/\d/.test(password)) strength += 25;

	// Contains lowercase
	if (/[a-z]/.test(password)) strength += 25;

	// Contains uppercase
	if (/[A-Z]/.test(password)) strength += 25;

	return strength;
}

function getPasswordStrengthColor(strength: number): string {
	if (strength <= 25) return 'bg-red-500';
	if (strength <= 50) return 'bg-orange-500';
	if (strength <= 75) return 'bg-yellow-500';
	return 'bg-green-500';
}

export function ProfileForm({
	defaultValues = defaultProfileSettings,
	onSave,
}: ProfileFormProps) {
	const [isSaving, setIsSaving] = React.useState(false);
	const [passwordStrength, setPasswordStrength] = React.useState(0);
	const { toast } = useToast();

	const form = useForm<ProfileSettings>({
		resolver: zodResolver(profileSchema),
		defaultValues,
	});

	const watchNewPassword = form.watch('newPassword');

	React.useEffect(() => {
		setPasswordStrength(calculatePasswordStrength(watchNewPassword || ''));
	}, [watchNewPassword]);

	const onSubmit = async (data: ProfileSettings) => {
		setIsSaving(true);
		try {
			await onSave(data);
			toast({
				title: 'Profile Updated',
				description: 'Your profile settings have been saved.',
			});
			// Clear password fields after successful save
			form.setValue('currentPassword', '');
			form.setValue('newPassword', '');
			form.setValue('confirmPassword', '');
		} catch {
			toast({
				title: 'Error',
				description:
					'Could not save profile settings. Please try again.',
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
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input
										placeholder='Your name'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										type='email'
										placeholder='you@example.com'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className='space-y-4'>
					<h4 className='text-sm font-medium'>Change Password</h4>
					<FormField
						control={form.control}
						name='currentPassword'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Current Password</FormLabel>
								<FormControl>
									<Input
										type='password'
										placeholder='Enter current password'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='newPassword'
						render={({ field }) => (
							<FormItem>
								<FormLabel>New Password</FormLabel>
								<FormControl>
									<Input
										type='password'
										placeholder='Enter new password'
										{...field}
									/>
								</FormControl>
								{watchNewPassword && (
									<div className='space-y-2'>
										<Progress
											value={passwordStrength}
											className={getPasswordStrengthColor(
												passwordStrength
											)}
										/>
										<p className='text-xs text-muted-foreground'>
											Password strength:{' '}
											{passwordStrength <= 25
												? 'Weak'
												: passwordStrength <= 50
												? 'Fair'
												: passwordStrength <= 75
												? 'Good'
												: 'Strong'}
										</p>
									</div>
								)}
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='confirmPassword'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Confirm New Password</FormLabel>
								<FormControl>
									<Input
										type='password'
										placeholder='Confirm new password'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
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
