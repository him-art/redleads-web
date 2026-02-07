import { z } from 'zod';

export const scannerSchema = z.object({
  url: z.string().url().optional(),
  email: z.string().email().optional(),
  action: z.enum(['SCAN', 'UNLOCK']),
}).refine((data) => {
  if (data.action === 'SCAN' && !data.url) return false;
  if (data.action === 'UNLOCK' && (!data.email || !data.url)) return false;
  return true;
}, {
  message: "URL is required for scanning, Email and URL are required for unlocking.",
  path: ["url", "email"]
});

export const onboardingSchema = z.object({
  description: z.string().min(20, "Please provide at least 20 characters for your product description."),
  keywords: z.array(z.string()).min(1, "Please provide at least one keyword."),
  url: z.string().url("Please provide a valid URL for your website.")
});

export const profileUpdateSchema = z.object({
  description: z.string().min(20).optional(),
  keywords: z.array(z.string()).min(1).optional(),
  website_url: z.string().url().optional(),
  is_beta_user: z.boolean().optional()
});
