
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        // 1. Auth Check
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data: status } = await supabase
            .from('user_access_status')
            .select('is_dev')
            .eq('id', user.id)
            .single();
            
        if (!status?.is_dev) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // 2. Get Draft
        const { draft_id } = await req.json();
        
        const { data: draft } = await supabase
            .from('email_drafts')
            .select(`
                *,
                profiles:user_id (email)
            `)
            .eq('id', draft_id)
            .single();

        if (!draft) return NextResponse.json({ error: 'Draft not found' }, { status: 404 });

        // 3. Send via Resend
        if (!process.env.RESEND_API_KEY) {
            console.warn('[Admin] Missing RESEND_API_KEY');
             // Mock success in dev if key missing
             // return NextResponse.json({ error: 'Resend API Key Missing' }, { status: 500 });
        }

        const { data, error } = await resend.emails.send({
            from: 'RedLeads <alerts@redleads.app>', // Update with your domain
            to: [draft.profiles.email],
            subject: draft.subject,
            html: draft.body_html,
        });

        if (error) {
            console.error('[Resend Error]', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // 4. Update Status
        await supabase
            .from('email_drafts')
            .update({ status: 'sent', sent_at: new Date().toISOString() })
            .eq('id', draft_id);

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
