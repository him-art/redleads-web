import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/supabase-middleware'
import { ratelimit } from '@/lib/ratelimit'
import { isIpBlocked } from '@/lib/ip-block'
import { createDualmarkMiddleware } from '@dualmark/nextjs'
import { detectAIBot, negotiateFormat } from '@dualmark/core'

const dualmarkMiddleware = createDualmarkMiddleware({
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.redleads.app',
})

export default async function proxy(request: NextRequest) {
  // 1. IP Block List
  const ip = (request as any).ip || request.headers.get('x-forwarded-for') || '127.0.0.1';
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

  const pathname = request.nextUrl.pathname
  const ua = request.headers.get('user-agent') || ''
  const botInfo = detectAIBot(ua)
  const acceptHeader = request.headers.get('accept') || ''

  // 3. For .md requests or AI bots → delegate fully to Dualmark
  //    Fixes: md.fetch (already passing)
  if (pathname.endsWith('.md') || botInfo.isBot || acceptHeader.includes('text/markdown')) {
    return dualmarkMiddleware(request)
  }

  // 4. Check for 406 Not Acceptable
  //    Fixes: negotiation.notAcceptable (-5)
  //    If the client sends an Accept header that excludes both html AND markdown, return 406
  if (acceptHeader && !acceptHeader.includes('*/*')) {
    const format = negotiateFormat(acceptHeader)
    if (format === null) {
      return new NextResponse('Not Acceptable', {
        status: 406,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      })
    }
  }

  // 5. Normal HTML request → Supabase session update + Link alternate header
  //    Fixes: html.linkAlternate (-10)
  const response = await updateSession(request)

  // Add Link rel=alternate header so HTML pages advertise their markdown twin
  const mdUrl = pathname === '/' ? '/index.md' : `${pathname.replace(/\/$/, '')}.md`
  response.headers.set('Link', `<${mdUrl}>; rel="alternate"; type="text/markdown"`)

  return response
}

export const config = {
  matcher: [
    {
      source: '/((?!_next/|favicon.ico|md/).*)',
      missing: [{ type: 'header', key: 'next-router-prefetch' }],
    },
  ],
}
