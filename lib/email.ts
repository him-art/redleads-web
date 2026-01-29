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
    from = process.env.EMAIL_FROM || 'RedLeads <onboarding@resend.dev>' 
}: SendEmailOptions) {
    try {
        const { data, error } = await resend.emails.send({
            from,
            to,
            subject,
            react,
        });

        if (error) {
            console.error('[Resend Error]:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err: any) {
        console.error('[SendEmail Exception]:', err.message);
        return { success: false, error: err.message };
    }
}
