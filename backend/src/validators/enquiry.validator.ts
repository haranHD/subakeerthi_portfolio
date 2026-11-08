import { z } from 'zod';

export const createEnquirySchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').max(100),
  organisation: z.string().trim().min(2, 'Organisation must be at least 2 characters').max(150),
  email: z.string().trim().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().trim().min(8, 'Phone number must be at least 8 digits').max(20).optional().or(z.literal('')),
  category: z.string().trim().min(2, 'Please select a category'),
  areaOfInterest: z.string().trim().min(2, 'Please select an area of interest'),
  preferredLanguage: z.string().optional(),
  requirements: z.string().trim().min(15, 'Requirements description must be at least 15 characters').max(2000),
});

export const updateEnquiryStatusSchema = z.object({
  status: z.enum(['NEW', 'PENDING', 'RESPONDED', 'ARCHIVED']),
  notes: z.string().optional(),
});
