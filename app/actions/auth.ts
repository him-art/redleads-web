'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export async function signInWithEmail(formData: FormData): Promise<{ error?: string; success?: boolean }> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function signUpWithEmail(formData: FormData): Promise<{ error?: string; success?: boolean }> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  
  // Strictly use the dynamic origin from headers to prevent subdomain mismatches (redleads.app vs www.redleads.app)
  const origin = `${protocol}://${host}`;

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createClient();

  console.log('Attempting signup for:', email);

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error('Signup error:', error.message);
    return { error: error.message };
  }

  // With "Confirm Email" disabled, data.user or data.session will be present immediately.
  console.log('Signup successful');
  return { success: true };
}

export async function signInWithGoogle(redirectTo?: string) {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  
  // Strictly use the dynamic origin from headers to prevent subdomain mismatches
  const origin = `${protocol}://${host}`;
  
  const supabase = await createClient();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback${redirectTo ? `?next=${encodeURIComponent(redirectTo)}` : ''}`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    return { url: data.url };
  }
}
