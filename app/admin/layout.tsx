import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Check if user is in dev_admins table
    const { data: adminData } = await supabase
        .from('dev_admins')
        .select('email')
        .eq('email', user.email)
        .single();

    if (!adminData) {
        // Not an admin, redirect to dashboard or 404
        redirect('/dashboard');
    }

    return <>{children}</>;
}
