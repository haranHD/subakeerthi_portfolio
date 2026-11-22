import { z } from 'zod';

const optionalNullableString = z
  .union([z.string().trim(), z.literal(''), z.null()])
  .optional()
  .transform((val) => (val === '' ? null : val));

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(2).optional(),
  headline: z.string().trim().min(2).optional(),
  biography: z.string().trim().min(10).optional(),
  location: optionalNullableString,
  phone: optionalNullableString,
  email: z
    .union([z.string().trim().email(), z.literal(''), z.null()])
    .optional()
    .transform((val) => (val === '' ? null : val)),
  portraitUrl: optionalNullableString,
  heroPills: z.array(z.string()).optional(),
  values: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    )
    .optional(),
});
