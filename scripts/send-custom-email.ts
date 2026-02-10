import { Resend } from 'resend';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.RESEND_API_KEY) {
    console.error('Error: RESEND_API_KEY is missing from environment variables.');
    process.exit(1);
}

const resend = new Resend(process.env.RESEND_API_KEY);

const emailHtml = `
<p>Hi there,</p>

<p>I noticed you've been monitoring these keywords:</p>
<ul>
    <li>Attio</li>
    <li>CRM SMB</li>
    <li>Attio Consulting</li>
    <li>CRM Australia</li>
    <li>Attio Implementation</li>
</ul>

<p>Zero results in 24 hours is actually normal for these &ndash; they're too specific. Most Reddit users don't know Attio exists yet, so they're not searching for it by name.</p>

<p>The good news? There are hundreds of people asking for CRM help daily. You just need to find them where they actually are.</p>

<p><strong>Try These Problem-Based Keywords Instead:</strong></p>

<p>High-intent (people actively looking):</p>
<ul>
    <li>"CRM recommendation"</li>
    <li>"switching CRM"</li>
    <li>"HubSpot expensive"</li>
    <li>"best CRM for"</li>
    <li>"CRM alternatives"</li>
</ul>

<p>Pain points (frustrated users):</p>
<ul>
    <li>"hate my CRM"</li>
    <li>"CRM doesn't integrate"</li>
    <li>"looking for new CRM"</li>
    <li>"CRM suggestions"</li>
</ul>

<p>Comparison searches:</p>
<ul>
    <li>"HubSpot vs"</li>
    <li>"Salesforce vs"</li>
    <li>"best CRM 2026"</li>
</ul>

<p>Why This Works:<br>
People complain about problems, not solutions they don't know exist. By monitoring pain points instead of product names, you'll find 10-20x more relevant conversations.</p>

<p>Quick Win: Start with just these 5 keywords:</p>
<ol>
    <li>"CRM recommendation"</li>
    <li>"switching CRM"</li>
    <li>"best CRM"</li>
    <li>"HubSpot expensive"</li>
    <li>"crm recommendation"</li>
</ol>

<p>You should start seeing daily alerts within 24-48 hours.</p>

<p>Let me know if you need help refining these further!</p>

<p>Best,<br>
Tim Jayas<br>
RedLeads.app</p>
`;

async function send() {
    try {
        console.log('Sending email...');
        const data = await resend.emails.send({
            from: 'Tim Jayas <onboarding@redleads.app>',
            to: ['hjayaswar@gmail.com'],
            subject: 'Quick feedback on your keywords',
            html: emailHtml,
        });
        
        if (data.error) {
            console.error('Resend Error:', data.error);
        } else {
            console.log('Email sent successfully:', data.data);
        }
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

send();
