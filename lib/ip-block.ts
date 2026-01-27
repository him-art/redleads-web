
/**
 * IP Block List Management
 * This can be expanded to fetch from a database or environment variables.
 */

// Static block list for known malicious IPs or problematic bots
const BLOCKED_IPS: string[] = [
  // Example: '1.2.3.4'
];

/**
 * Checks if an IP is in the block list
 * @param ip The visitor's IP address
 */
export function isIpBlocked(ip: string): boolean {
  if (!ip) return false;
  
  // Also check if ip is explicitly set to be blocked in environment variables
  const envBlocked = process.env.BLOCKED_IPS?.split(',') || [];
  
  return BLOCKED_IPS.includes(ip) || envBlocked.includes(ip);
}
