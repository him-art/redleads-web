import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ScannerClient from './ScannerClient';

export default async function ScannerPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // If not logged in, go to login
    // Allow anonymous access for the free scan trial
    // if (!user) {
    //     redirect('/login');
    // }

    return <ScannerClient initialUser={user} />;
}
