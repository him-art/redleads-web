import { createHash } from 'crypto';

/**
 * Generates a secure, verify-only hash token for a given email address.
 * Hashed with the server's private service role key to prevent spoofing.
 */
export function getUnsubscribeToken(email: string): string {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY || 'default-fallback-secret';
  return createHash('sha256')
    .update(email.toLowerCase().trim() + secret)
    .digest('hex');
}

/**
 * Verifies that a given unsubscribe token matches the expected hash for that email.
 */
export function verifyUnsubscribeToken(email: string, token: string): boolean {
  if (!email || !token) return false;
  const expected = getUnsubscribeToken(email);
  return expected === token;
}

/**
 * Returns the browser-facing unsubscribe confirmation page URL.
 */
export function getUnsubscribeUrl(email: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.redleads.app';
  const cleanEmail = email.toLowerCase().trim();
  const token = getUnsubscribeToken(cleanEmail);
  return `${baseUrl}/unsubscribe?email=${encodeURIComponent(cleanEmail)}&token=${token}`;
}

/**
 * Returns the API endpoint URL for RFC 8058 one-click unsubscribe headers.
 */
export function getOneClickUrl(email: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.redleads.app';
  const cleanEmail = email.toLowerCase().trim();
  const token = getUnsubscribeToken(cleanEmail);
  return `${baseUrl}/api/unsubscribe?email=${encodeURIComponent(cleanEmail)}&token=${token}`;
}
