import { Resend } from 'resend';
import * as React from 'react';

let resendInstance: Resend;

function getResend() {
    if (!resendInstance) {
        if (!process.env.RESEND_API_KEY) {
            console.error('[Resend] ❌ ERROR: RESEND_API_KEY is not defined in environment.');
        }
        resendInstance = new Resend(process.env.RESEND_API_KEY);
    }
    return resendInstance;
}

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
}: SendEmailOptions, supabaseOverride?: any) {
    try {
        // Render to static HTML for maximal compatibility with Resend
        let html: string;
        try {
            const { renderToStaticMarkup } = await import('react-dom/server');
            html = renderToStaticMarkup(react);
        } catch (renderErr: any) {
            console.error('[Email Render Error]:', renderErr.message);
            throw new Error(`Failed to render email: ${renderErr.message}`);
        }

        const { data, error } = await getResend().emails.send({
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
            let supabase = supabaseOverride;
            
            // Note: We no longer auto-import the server client here because it depends on next/headers,
            // which breaks in worker/background environments. 
            // Callers in Next.js should pass a client if they want logging.
            
            if (supabase) {
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
                    context: (react.props as any)?.stage ? { stage: (react.props as any).stage } : null
                });
            }
        } catch (logErr) {
            console.error('[Email Log Error]:', logErr);
        }

        return { success: true, data };
    } catch (err: any) {
        console.error('[SendEmail Exception]:', err.message);
        return { success: false, error: err.message };
    }
}
