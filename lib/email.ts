import { Resend } from 'resend';
import * as React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailOptions {
    to: string | string[];
    subject: string;
    react: React.ReactElement;
    from?: string;
}

/**
 * Central utility for sending transactional emails via Resend.
 * Uses the default Resend verified domain or the one provided in env.
 */
export async function sendEmail({ 
    to, 
    subject, 
    react, 
    from = process.env.EMAIL_FROM || 'RedLeads <onboarding@redleads.app>' 
}: SendEmailOptions) {
    try {
        // Render to static HTML for maximal compatibility with Resend
        let html: string;
        try {
            // Use dynamic import to bypass Turbopack's static analysis of react-dom/server
            const { renderToStaticMarkup } = await import('react-dom/server');
            html = renderToStaticMarkup(react);
        } catch (renderErr: any) {
            console.error('[Email Render Error]:', renderErr.message);
            throw new Error(`Failed to render email: ${renderErr.message}`);
        }

        const { data, error } = await resend.emails.send({
            from,
            to,
            subject,
            html,
        });

        if (error) {
            console.error('[Resend Error]:', error);
            return { success: false, error };
        }

        // Log the email to the database (Best effort)
        try {
            const { createClient } = await import('@/lib/supabase/server');
            const supabase = await createClient();
            
            // Extract recipient email as string
            const toEmail = Array.isArray(to) ? to[0] : to;

            // Attempt to find user_id by email if possible
            const { data: profile } = await supabase
                .from('profiles')
                .select('id')
                .eq('email', toEmail)
                .single();

            await supabase.from('email_logs').insert({
                user_id: profile?.id || null,
                to_email: toEmail,
                subject,
                context: (react.props as any)?.leads ? { leads: (react.props as any).leads.map((l: any) => l.title) } : null
            });
        } catch (logErr) {
            console.error('[Email Log Error]:', logErr);
        }

        return { success: true, data };
    } catch (err: any) {
        console.error('[SendEmail Exception]:', err.message);
        return { success: false, error: err.message };
    }
}
