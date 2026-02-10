const { Resend } = require('resend');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.RESEND_API_KEY) {
    console.error('Error: RESEND_API_KEY is missing.');
    process.exit(1);
}

const resend = new Resend(process.env.RESEND_API_KEY);

// We'll use the raw HTML since we want to avoid complex build steps for a one-off script
// This HTML is based on the CustomFeedbackEmail.tsx template design
const emailHtml = `
<div style="background-color: #050505; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 20px; line-height: 1.6;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #111111; border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.05); overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.4);">
    <div style="padding: 40px 40px 20px 40px; text-align: center;">
      <img src="https://redleads.app/redleads-logo-white.png" alt="RedLeads Logo" style="height: 32px; margin-bottom: 24px;" />
      <h1 style="font-size: 28px; font-weight: 900; letter-spacing: -1px; margin: 0 0 12px 0; color: #ffffff; line-height: 1.2;">
        Strategy Audit: Unlocking your Reddit Growth
      </h1>
      <p style="font-size: 16px; color: #888888; margin: 0; font-weight: 500;">
        How to 10x your lead volume by monitoring intent.
      </p>
    </div>
    <div style="height: 1px; background: linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent); margin: 0 40px;"></div>
    <div style="padding: 40px;">
      <p style="font-size: 15px; color: #cccccc; margin: 0 0 24px 0;">Hi there,</p>
      <p style="font-size: 15px; color: #cccccc; margin: 0 0 20px 0;">I noticed you've been monitoring these keywords:</p>
      <div style="padding: 0 0 24px 20px;">
        <ul style="color: #f25e36; font-weight: bold; font-size: 14px; margin: 0;">
          <li style="margin-bottom: 8px;">Attio</li>
          <li style="margin-bottom: 8px;">CRM SMB</li>
          <li style="margin-bottom: 8px;">Attio Consulting</li>
          <li style="margin-bottom: 8px;">CRM Australia</li>
          <li>Attio Implementation</li>
        </ul>
      </div>
      <p style="font-size: 15px; color: #cccccc; margin: 0 0 24px 0;">
        Zero results in 24 hours is actually normal for these &ndash; they're <strong>too specific</strong>. Most Reddit users don't know Attio exists yet, so they're not searching for it by name.
      </p>
      <p style="font-size: 15px; color: #cccccc; margin: 0 0 24px 0;">
        The good news? There are hundreds of people asking for CRM help daily. You just need to find them where they actually are.
      </p>
      <div style="background-color: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 24px; margin-bottom: 32px;">
        <h3 style="font-size: 12px; font-weight: 900; color: #f25e36; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 16px 0;">Try These Problem-Based Keywords:</h3>
        <p style="font-size: 14px; color: #ffffff; font-weight: 700; margin: 0 0 8px 0;">High-intent (active seekers):</p>
        <p style="font-size: 13px; color: #888888; margin: 0 0 16px 0; font-style: italic;"> "CRM recommendation", "switching CRM", "HubSpot expensive", "best CRM for", "CRM alternatives" </p>
        <p style="font-size: 14px; color: #ffffff; font-weight: 700; margin: 0 0 8px 0;">Pain points (frustrated users):</p>
        <p style="font-size: 13px; color: #888888; margin: 0 0 16px 0; font-style: italic;"> "hate my CRM", "CRM doesn't integrate", "looking for new CRM", "CRM suggestions" </p>
        <p style="font-size: 14px; color: #ffffff; font-weight: 700; margin: 0 0 8px 0;">Comparison searches:</p>
        <p style="font-size: 13px; color: #888888; margin: 0; font-style: italic;"> "HubSpot vs", "Salesforce vs", "best CRM 2026" </p>
      </div>
      <p style="font-size: 15px; color: #cccccc; margin: 0 0 24px 0;">
        <strong>Why This Works:</strong><br/>
        People complain about problems, not solutions they don't know exist. By monitoring pain points instead of product names, you'll find 10-20x more relevant conversations.
      </p>
      <div style="background-color: rgba(242, 94, 54, 0.05); border: 1px solid rgba(242, 94, 54, 0.1); border-radius: 16px; padding: 24px; margin-bottom: 32px;">
        <h3 style="font-size: 12px; font-weight: 900; color: #f25e36; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 12px 0;">Quick Win: Top 5 Keywords</h3>
        <ol style="font-size: 14px; color: #ffffff; font-weight: 600; margin: 0; padding-left: 20px;">
          <li style="margin-bottom: 4px;">"CRM recommendation"</li>
          <li style="margin-bottom: 4px;">"switching CRM"</li>
          <li style="margin-bottom: 4px;">"best CRM"</li>
          <li style="margin-bottom: 4px;">"HubSpot expensive"</li>
          <li>"crm recommendation"</li>
        </ol>
      </div>
      <p style="font-size: 15px; color: #cccccc; margin: 0 0 32px 0;">
        You should start seeing daily alerts within 24-48 hours. Let me know if you need help refining these further!
      </p>
      <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 24px;">
        <p style="font-size: 15px; color: #ffffff; font-weight: 700; margin: 0 0 4px 0;">Tim Jayas</p>
        <p style="font-size: 13px; color: #888888; margin: 0;">Founder @ RedLeads.app</p>
      </div>
    </div>
    <div style="padding: 40px; background-color: #0a0a0a; border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
      <p style="font-size: 13px; color: #555555; margin: 0 0 12px 0;">
        Direct support: <a href="mailto:Redleads.app@gmail.com" style="color: #888888; text-decoration: underline;">Redleads.app@gmail.com</a>
      </p>
      <p style="font-size: 11px; color: #333333; margin: 0;">
        Built for growth by <a href="https://x.com/timjayas" style="color: #555555; text-decoration: none;">@timjayas</a>
      </p>
    </div>
  </div>
  <p style="text-align: center; font-size: 11px; color: #444444; margin-top: 32px;">
    RedLeads.app &mdash; Automated Reddit Lead Generation. <br/>
    You are receiving this strategy update as a RedLeads user.
  </p>
</div>
`;

async function send() {
    try {
        console.log('Sending professional feedback email...');
        const data = await resend.emails.send({
            from: 'Tim Jayas <onboarding@redleads.app>',
            to: ['hjayaswar@gmail.com'],
            subject: 'Strategy Audit: Unlocking your Reddit Growth',
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
