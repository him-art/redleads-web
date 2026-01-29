import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import LoginForm from './LoginForm';

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  // If already logged in, go to scanner
  if (session) {
    redirect('/dashboard');
  }
  
  return <LoginForm />;
}
