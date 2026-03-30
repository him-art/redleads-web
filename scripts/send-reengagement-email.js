/**
 * One-off script to send a re-engagement email to hjayaswar@gmail.com
 * Run: node scripts/send-reengagement-email.js
 */

require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome back — your sign-up is ready!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050505; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #050505; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #0F0F0F; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center;">
              <img src="https://redleads.app/redleads-logo-white.png" alt="RedLeads" width="50" style="margin-bottom: 16px;">
              <h1 style="color: #fff; font-size: 24px; margin: 0; font-weight: 600;">Welcome back!</h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 20px 40px 30px; color: #a0a0a0; font-size: 16px; line-height: 1.6;">
              <p style="margin: 0 0 16px;">Hi there,</p>
              
              <p style="margin: 0 0 16px;">When you tried signing up earlier, a bug in our onboarding flow may have stopped you from completing registration.</p>
              
              <p style="margin: 0 0 24px;"><strong style="color: #fff;">We've fixed the issue</strong>, and you can now join without any problems.</p>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 10px 0 30px;">
                    <a href="https://redleads.app/dashboard" style="display: inline-block; background: linear-gradient(135deg, #f97316, #ea580c); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      Complete Your Sign-Up →
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 16px;">If you have any questions, feel free to reach out:</p>
              
              <ul style="margin: 0 0 24px; padding-left: 20px; color: #a0a0a0;">
                <li style="margin-bottom: 8px;">📧 Email: <a href="mailto:redleads.app@gmail.com" style="color: #f97316;">redleads.app@gmail.com</a></li>
                <li>🐦 X (Twitter): <a href="https://x.com/timjayas" style="color: #f97316;">@timjayas</a></li>
              </ul>
              
              <p style="margin: 0;">We're excited to have you onboard!</p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px 30px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                Best,<br>
                <strong style="color: #fff;">The RedLeads Team</strong>
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Unsubscribe -->
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          © 2026 RedLeads. Find your first 100 users on Reddit.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const recipients = [
  'andreiantal30@gmail.com',
  'pirolla40@gmail.com',
  'hello@markksantos.com'
];

// Helper to wait between sends
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function sendReengagementEmail() {
  console.log(`Sending re-engagement emails to ${recipients.length} recipients...`);
  
  for (const email of recipients) {
    try {
      console.log(`\n📧 Sending to: ${email}`);
      const { data, error } = await resend.emails.send({
        from: 'RedLeads <onboarding@redleads.app>',
        to: email,
        subject: "We've fixed the issue and ready for you to join!",
        html: emailHtml,
      });

      if (error) {
        console.error(`❌ Failed to send to ${email}:`, error);
        continue;
      }

      console.log(`✅ Sent to ${email} (ID: ${data?.id})`);
      
      // Wait 2 seconds between emails to avoid rate limiting
      await sleep(2000);
    } catch (err) {
      console.error(`❌ Exception for ${email}:`, err);
    }
  }
  
  console.log('\n🎉 All emails processed!');
}

sendReengagementEmail();
async function sendSingleEmail() {
  console.log('Sending re-engagement email to hjayaswar@gmail.com...');
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'RedLeads <onboarding@redleads.app>',
      to: 'hjayaswar@gmail.com',
      subject: "We've fixed the issue and ready for you to join!",
      html: emailHtml,
    });

    if (error) {
      console.error('❌ Failed to send email:', error);
      return;
    }

    console.log('✅ Email sent successfully!');
    console.log('Email ID:', data?.id);
  } catch (err) {
    console.error('❌ Exception:', err);
  }
}

sendReengagementEmail();
