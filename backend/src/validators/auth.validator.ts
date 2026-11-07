import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(2).optional(),
  headline: z.string().trim().min(2).optional(),
  biography: z.string().trim().min(10).optional(),
  location: z.string().trim().min(2).optional(),
  phone: z.string().trim().min(8).optional(),
  email: z.string().trim().email().optional(),
  portraitUrl: z.string().optional(),
  heroPills: z.array(z.string()).optional(),
  values: z.array(z.object({
    title: z.string(),
    description: z.string()
  })).optional(),
});
