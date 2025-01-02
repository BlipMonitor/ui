import { z } from 'zod';

export const profileSchema = z
	.object({
		name: z
			.string()
			.min(2, 'Name must be at least 2 characters')
			.max(50, 'Name must be less than 50 characters'),
		email: z.string().email('Please enter a valid email address'),
		currentPassword: z.string().optional(),
		newPassword: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.regex(
				/[A-Z]/,
				'Password must contain at least one uppercase letter'
			)
			.regex(
				/[a-z]/,
				'Password must contain at least one lowercase letter'
			)
			.regex(/[0-9]/, 'Password must contain at least one number')
			.optional(),
		confirmPassword: z.string().optional(),
	})
	.refine(
		(data) => {
			// If any password field is filled, all password fields must be filled
			if (
				data.currentPassword ||
				data.newPassword ||
				data.confirmPassword
			) {
				return (
					data.currentPassword &&
					data.newPassword &&
					data.confirmPassword
				);
			}
			return true;
		},
		{
			message: 'All password fields must be filled to change password',
			path: ['newPassword'],
		}
	)
	.refine(
		(data) => {
			// If new password is provided, it must match confirm password
			if (data.newPassword && data.confirmPassword) {
				return data.newPassword === data.confirmPassword;
			}
			return true;
		},
		{
			message: 'Passwords do not match',
			path: ['confirmPassword'],
		}
	);

export type ProfileSettings = z.infer<typeof profileSchema>;

export const defaultProfileSettings: ProfileSettings = {
	name: '',
	email: '',
};
