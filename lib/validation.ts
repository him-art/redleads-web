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
