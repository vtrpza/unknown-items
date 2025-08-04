import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' }),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: 'Username must be at least 3 characters' })
      .max(30, { message: 'Username must be less than 30 characters' })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: 'Username can only contain letters, numbers, and underscores',
      }),
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Please enter a valid email address' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' })
      .max(100, { message: 'Password must be less than 100 characters' }),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, { message: 'Token is required' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' })
      .max(100, { message: 'Password must be less than 100 characters' }),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const profileSchema = z.object({
  displayName: z
    .string()
    .max(50, { message: 'Display name must be less than 50 characters' })
    .optional(),
  bio: z
    .string()
    .max(500, { message: 'Bio must be less than 500 characters' })
    .optional(),
  location: z
    .string()
    .max(100, { message: 'Location must be less than 100 characters' })
    .optional(),
  website: z
    .string()
    .url({ message: 'Please enter a valid URL' })
    .optional()
    .or(z.literal('')),
  interests: z
    .array(z.string())
    .max(10, { message: 'You can have up to 10 interests' })
    .optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
