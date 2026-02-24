import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/supabase-middleware'
import { ratelimit } from '@/lib/ratelimit'
import { isIpBlocked } from '@/lib/ip-block'

export async function proxy(request: NextRequest) {
  // Use a fallback for IP detection that works in different environments
  const ip = (request as any).ip || request.headers.get('x-forwarded-for') || '127.0.0.1';

  // 1. IP Block List
  if (isIpBlocked(ip)) {
    return new NextResponse('Access Denied', { status: 403 })
  }

  // 2. Rate Limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    try {
      const { success, limit, reset, remaining } = await ratelimit.limit(ip)
      
      if (!success) {
        return NextResponse.json({ error: 'Too Many Requests' }, {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          },
        })
      }
    } catch (e) {
      console.warn('Ratelimit failed (likely missing credentials), skipping check.');
    }
  }

  console.log('Proxy Request:', request.nextUrl.pathname, '| Cookies:', request.cookies.getAll().length);
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
