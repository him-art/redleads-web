import { Resend } from 'resend';
import * as dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.RESEND_API_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Error: Required environment variables are missing.');
    process.exit(1);
}

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const emailHtml = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1a1a1a; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
    <h2 style="color: #f25e36; margin-top: 0;">Quick Update on RedLeads Performance 🚀</h2>
    <p>Hi there,</p>
    
    <p>I'm reaching out with a quick update and a sincere apology.</p>
    
    <p>Over the past couple of days, we experienced a massive surge in new users that temporarily pushed our infrastructure beyond its limits. While this is an exciting milestone for us, it did cause service interruptions and performance issues for some of our users.</p>
    
    <p>Whether you were actively using the platform during this time or were planning to, I wanted to ensure you knew that we've now fully resolved these bottlenecks. <strong>Our systems are back to 100% capacity</strong>, running faster and more reliably than before.</p>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="https://redleads.app/dashboard" style="background-color: #f25e36; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 800; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Open Command Center</a>
    </div>
    
    <p>If you have any questions or notice anything still feels off, please just reply to this email. I'm always here to help you get the most out of your lead intelligence.</p>
    
    <p>Best,<br>
    <strong>Tim Jayas</strong><br>
    Founder, RedLeads.app</p>
</div>
`;

async function run() {
    try {
        console.log('📡 Fetching active trial and paid users from Supabase...');
        
        const { data: users, error } = await supabase
            .from('profiles')
            .select('email, subscription_tier, trial_ends_at')
            .or(`subscription_tier.in.(starter,growth,lifetime),and(subscription_tier.eq.trial,or(trial_ends_at.gt.${new Date().toISOString()},trial_ends_at.is.null))`);

        if (error) {
            console.error('Supabase Error:', error);
            return;
        }

        if (!users || users.length === 0) {
            console.log('No users found matching the criteria.');
            return;
        }

        // Filter out any potential null emails just in case
        const validUsers = users.filter(u => u.email && u.email.includes('@'));

        console.log(`🎯 Found ${validUsers.length} target users.`);
        
        for (const user of validUsers) {
            console.log(`📤 Sending to: ${user.email} (${user.subscription_tier})...`);
            
            try {
                const data = await resend.emails.send({
                    from: 'Tim Jayas <tim@redleads.app>',
                    to: [user.email],
                    subject: 'Quick Update on RedLeads Performance 🚀',
                    html: emailHtml,
                });

                if (data.error) {
                    console.error(`❌ Failed to send to ${user.email}:`, data.error);
                } else {
                    console.log(`✅ Sent to ${user.email} (ID: ${data.data?.id})`);
                }
            } catch (err) {
                console.error(`❌ Error sending to ${user.email}:`, err);
            }

            // Safety delay: 1 second between sends
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log('\n✨ Mass email update complete.');

    } catch (error) {
        console.error('Fatal Error:', error);
    }
}

run();
