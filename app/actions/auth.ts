'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function signInWithEmail(formData: FormData): Promise<{ error: string } | never> {
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

  revalidatePath('/', 'layout');
  const redirectTo = formData.get('redirectTo') as string || '/dashboard';
  redirect(redirectTo);
}

export async function signUpWithEmail(formData: FormData): Promise<{ error?: string; success?: string }> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (await headers()).get('origin');
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createClient();

  console.log('Attempting signup for:', email);

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    console.error('Signup error:', error.message);
    return { error: error.message };
  }

  // With "Confirm Email" disabled, data.user or data.session will be present immediately.
  console.log('Signup successful, redirecting to scanner');
  revalidatePath('/', 'layout');
  const redirectTo = formData.get('redirectTo') as string || '/dashboard';
  redirect(redirectTo);
}

export async function signInWithGoogle(redirectTo?: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (await headers()).get('origin');
  const supabase = await createClient();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${siteUrl}/auth/callback${redirectTo ? `?next=${encodeURIComponent(redirectTo)}` : ''}`,
    },
  });

  if (error) {
    redirect('/login?error=' + encodeURIComponent(error.message));
  }

  if (data.url) {
    redirect(data.url);
  }
}
