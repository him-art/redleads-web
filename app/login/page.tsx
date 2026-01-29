import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import LoginForm from './LoginForm';

export default async function LoginPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const params = await searchParams;
  const next = typeof params.next === 'string' ? params.next : '/dashboard';
  const search = typeof params.search === 'string' ? params.search : '';

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  // If already logged in, go to scanner
  if (session) {
    redirect(search ? `${next}?search=${encodeURIComponent(search)}` : next);
  }
  
  return <LoginForm next={next} search={search} />;
}
