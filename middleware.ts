import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Basic in-memory rate limiter (Note: This will reset on server restarts/deployments)
// For production, use Upstash or a persistent store.
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10;
const ipRequests = new Map<string, { count: number, lastRequest: number }>();

// IP Block List
const BLOCKED_IPS = [
    '1.2.3.4', // Example blocked IP
];

export function middleware(request: NextRequest) {
    // @ts-ignore - ip is available in Next.js middleware but can have type issues in some environments
    const ip = request.ip || request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';

    // 1. Check IP Block List
    if (BLOCKED_IPS.includes(ip)) {
        return new NextResponse(null, { status: 403, statusText: 'Forbidden' });
    }

    // 2. Rate Limiting for API routes
    if (request.nextUrl.pathname.startsWith('/api')) {
        const now = Date.now();
        const stats = ipRequests.get(ip);

        if (stats) {
            if (now - stats.lastRequest < RATE_LIMIT_WINDOW) {
                if (stats.count >= MAX_REQUESTS) {
                    return new NextResponse(null, { status: 429, statusText: 'Too Many Requests' });
                }
                stats.count++;
            } else {
                stats.count = 1;
                stats.lastRequest = now;
            }
        } else {
            ipRequests.set(ip, { count: 1, lastRequest: now });
        }
    }

    const response = NextResponse.next();

    // 3. Security Headers (redundant with next.config.ts but good practice)
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');

    return response;
}

export const config = {
    matcher: '/api/:path*',
};
