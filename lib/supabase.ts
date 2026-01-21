import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  // Build time safety check
  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window !== 'undefined') {
      console.error('Supabase URL and Anon Key are required!');
    }
    // Return a dummy client or handle it in the calling components
    // Returning dummy values to prevent crashing during build prerendering
    return createBrowserClient(
      supabaseUrl || 'https://placeholder.supabase.co', 
      supabaseAnonKey || 'placeholder'
    );
  }

  // When in the browser, use the proxy URL (the site's own domain)
  // to show the custom domain in Google/OAuth popups for free.
  const finalUrl = (typeof window !== 'undefined') 
    ? window.location.origin 
    : supabaseUrl;

  return createBrowserClient(finalUrl, supabaseAnonKey);
}
