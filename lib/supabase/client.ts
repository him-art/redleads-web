import { createBrowserClient } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | undefined;

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Build time safety check
  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window !== 'undefined') {
      console.error('Supabase URL and Anon Key are required!');
    }
    // Return dummy values to prevent crashing during build prerendering
    return createBrowserClient(
      supabaseUrl || 'https://placeholder.supabase.co', 
      supabaseAnonKey || 'placeholder'
    );
  }

  // Singleton for browser environment
  if (typeof window !== 'undefined') {
    if (client) return client;
    client = createBrowserClient(supabaseUrl, supabaseAnonKey);
    return client;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
