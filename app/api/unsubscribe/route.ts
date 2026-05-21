import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyUnsubscribeToken } from '@/lib/unsubscribe';

/**
 * GET handler: Redirects query-based requests to the user-facing confirmation page.
 * This prevents email web crawlers and spam bots from automatically unsubscribing users.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    if (!email || !token) {
      return NextResponse.json({ error: 'Missing email or token' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.redleads.app';
    const redirectUrl = `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
    return NextResponse.redirect(redirectUrl);
  } catch (error: any) {
    console.error('[Unsubscribe GET Error]', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/**
 * POST handler: Actually performs the database update.
 * Supports both JSON body payloads and URL query params (for Gmail/Yahoo one-click headers).
 */
export async function POST(req: Request) {
  try {
    let email = '';
    let token = '';
    let action = 'unsubscribe'; // 'unsubscribe' or 'subscribe'

    // 1. Try parsing JSON body (from interactive React page)
    try {
      const body = await req.json();
      email = body.email || '';
      token = body.token || '';
      action = body.action || 'unsubscribe';
    } catch {
      // 2. Fallback to URL search parameters (from Gmail one-click unsubscribe headers)
      const { searchParams } = new URL(req.url);
      email = searchParams.get('email') || '';
      token = searchParams.get('token') || '';
    }

    if (!email || !token) {
      return NextResponse.json({ error: 'Missing email or token' }, { status: 400 });
    }

    // 3. Verify token authenticity
    if (!verifyUnsubscribeToken(email, token)) {
      return NextResponse.json({ error: 'Invalid token signature' }, { status: 400 });
    }

    // Use service role to bypass RLS since the client is unauthenticated
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const isUnsubscribe = action === 'unsubscribe';
    const cleanEmail = email.toLowerCase().trim();

    // 4. Update the profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ unsubscribed: isUnsubscribe })
      .eq('email', cleanEmail);

    if (profileError) {
      console.error('[Unsubscribe API] Profile update error:', profileError);
      return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
    }

    // 5. Also update newsletter_subscribers table if they exist there
    const newsletterStatus = isUnsubscribe ? 'unsubscribed' : 'active';
    const { error: newsletterError } = await supabase
      .from('newsletter_subscribers')
      .update({ status: newsletterStatus })
      .eq('email', cleanEmail);

    if (newsletterError) {
      // Don't fail if they are not in the newsletter list
      console.warn('[Unsubscribe API] Newsletter update warning:', newsletterError.message);
    }

    console.log(`[Unsubscribe API] Success: ${cleanEmail} set to unsubscribed = ${isUnsubscribe}`);

    return NextResponse.json({ success: true, action });
  } catch (error: any) {
    console.error('[Unsubscribe POST Error]', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
