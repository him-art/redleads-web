import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin

  if (code) {
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              // Silently handle cookie set errors in middleware/route handlers
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch (error) {
              // Silently handle cookie remove errors
            }
          },
        },
      }
    )
    
    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error || !data.session) {
      console.error('OAuth Code Exchange Error:', error?.message || 'No session returned');
      return NextResponse.redirect(`${siteUrl}/login?error=OAuth failed`)
    }

    // EXPLICITLY set the session to force cookie persistence across browser/server
    await supabase.auth.setSession({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    })
    
    return NextResponse.redirect(`${siteUrl}${next}`)
  }

  return NextResponse.redirect(`${siteUrl}/login?error=No code provided`)
}
