import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Basic security headers
  supabaseResponse.headers.set('X-XSS-Protection', '1; mode=block')
  supabaseResponse.headers.set('X-Frame-Options', 'DENY')
  supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff')

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // refreshing the auth token
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    console.log('Middleware: User session found');
  } else {
    console.log('Middleware: No active session');
  }

    // 4. IMPORTANT: Admin Protection (The Bouncer)
    const url = request.nextUrl.clone();
    if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/app/api/admin')) {
      if (!user) {
        // Not logged in -> 404 (Security by obscurity)
        console.warn(`[Security] Unauthorized access to ${url.pathname} (No User)`);
        url.pathname = '/404';
        return NextResponse.rewrite(url);
      }

      // Check Admin Flag in dev_admins table (Service Role to bypass RLS)
      const { createClient } = await import('@supabase/supabase-js')
      const adminClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      
      const { count, error } = await adminClient
        .from('dev_admins')
        .select('*', { count: 'exact', head: true })
        .eq('email', user.email);
      
      console.log(`[Security Debug] Checking ${user.email} against dev_admins...`);
      if (error) console.log(`[Security Debug] Error:`, error);
      
      if (!count || count === 0) {
        // Logged in but not a dev admin -> 404
        console.warn(`[Security] Unauthorized access to ${url.pathname} by ${user.email} (Not in dev_admins)`);
        url.pathname = '/404';
        return NextResponse.rewrite(url);
      }
    }

    return supabaseResponse
}
