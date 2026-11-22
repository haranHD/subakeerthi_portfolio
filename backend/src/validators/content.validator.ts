import { z } from 'zod';

// Helper for optional string fields that might be null, empty string, or undefined
const optionalNullableString = z
  .union([z.string().trim(), z.literal(''), z.null()])
  .optional()
  .transform((val) => (val === '' ? null : val));

export const serviceSchema = z.object({
  title: z.string().trim().min(2),
  slug: optionalNullableString,
  tag: z.string().trim().min(2),
  category: z.string().trim().min(2),
  description: z.string().trim().min(10),
  audience: z.string().trim().min(2),
  icon: z.string().trim().min(2).default('ShieldCheck'),
  displayOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export const programmeSchema = z.object({
  title: z.string().trim().min(2),
  slug: optionalNullableString,
  category: z.string().trim().min(2),
  intendedAudience: z.string().trim().min(2),
  purpose: z.string().trim().min(5),
  description: z.string().trim().min(10),
  highlights: z.array(z.string()).default([]),
  duration: optionalNullableString,
  bannerUrl: optionalNullableString,
  displayOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export const credentialSchema = z.object({
  credentialType: z.enum(['EDUCATION', 'ACCREDITATION']),
  institution: z.string().trim().min(2),
  qualification: z.string().trim().min(2),
  period: z.string().trim().min(2),
  status: z.string().trim().min(2),
  details: z.string().trim().min(5),
  issuingBody: optionalNullableString,
  statutoryDomain: optionalNullableString,
  certificateUrl: optionalNullableString,
  displayOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export const audienceSchema = z.object({
  title: z.string().trim().min(2),
  badge: z.string().trim().min(2),
  icon: z.string().trim().min(2).default('Users'),
  description: z.string().trim().min(10),
  actionText: z.string().trim().min(2),
  displayOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export const siteSettingSchema = z.object({
  key: z.string().trim().min(1),
  value: z.string(),
  description: optionalNullableString,
});
