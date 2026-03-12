import * as React from 'react';

interface TrialLifecycleEmailProps {
  fullName: string;
  stage: 'day1' | 'day2' | 'day3';
}

export default function TrialLifecycleEmail({ fullName, stage }: TrialLifecycleEmailProps) {
  const firstName = fullName ? fullName.split(' ')[0] : 'there';
  const siteUrl = 'https://redleads.app';
  const logoUrl = `${siteUrl}/redleads-logo-white.png`;

  const content = {
    day1: {
      preheader: `Have you tried the AI Reply feature yet, ${firstName}?`,
      tag: 'Pro Tip',
      tagColor: '#3b82f6', // Blue
      title: 'How to save 3 hours a day on Reddit',
      body: `Hi ${firstName},\n\nYou're 24 hours into your trial with RedLeads. Are you getting the most out of it?\n\nMost founders spend hours reading threads and typing out replies. With our **AI Reply Drafter**, you can generate highly-contextual, non-salesy responses in one click directly from your dashboard.\n\nLog in today and try generating your first reply. Remember: the best comments consult, they don't sell.`,
      cta: 'Try AI Reply Now',
      ctaUrl: `${siteUrl}/dashboard?utm_source=lifecycle&utm_medium=email&utm_campaign=day1_value`
    },
    day2: {
      preheader: 'Your trial ends tomorrow. Here is what other founders are saying.',
      tag: 'Founders',
      tagColor: '#10b981', // Green
      title: 'See why founders love RedLeads',
      body: `Hi ${firstName},\n\nYour 3-day trial is coming to an end tomorrow. Before it expires, we wanted to share what other founders are achieving with RedLeads:\n\n💬 *"I found 12 high-intent leads in my first day that I would have completely missed."* - Sarah, Indie Hacker\n\n💬 *"The AI filtering is magic. I don't get alerted for spam anymore."* - Mark, SaaS Founder\n\nDon't lose your competitive edge on Reddit. Upgrade today to keep your daily intelligence flowing indefinitely.`,
      cta: 'View Upgrade Plans',
      ctaUrl: `${siteUrl}/dashboard?tab=billing&utm_source=lifecycle&utm_medium=email&utm_campaign=day2_social_proof`
    },
    day3: {
      preheader: 'Your lead scanner has been paused.',
      tag: 'Alert',
      tagColor: '#f43f5e', // Red
      title: 'Your trial has expired',
      body: `Hi ${firstName},\n\nYour 3-day free trial on RedLeads has officially ended. We loved having you on board!\n\n**Your lead scanner is currently paused.** \n\nTo restart your daily intelligence drops and unlock full access to the AI Reply Drafter, please select a plan on your dashboard. Opportunities are happening right now on Reddit—don't miss out.`,
      cta: 'Upgrade to Reactivate',
      ctaUrl: `${siteUrl}/dashboard?tab=billing&utm_source=lifecycle&utm_medium=email&utm_campaign=day3_expiry`
    }
  };

  const currentContent = content[stage];

  return (
    <div style={{
      backgroundColor: '#050505',
      color: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      padding: '40px 10px',
      lineHeight: '1.6'
    }}>
      <div style={{ display: 'none', maxWidth: 0, maxHeight: 0, overflow: 'hidden', opacity: 0 }}>
        {currentContent.preheader}
      </div>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#111111',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
      }}>
        {/* Header */}
        <div style={{ padding: '40px 30px', textAlign: 'center' }}>
          <img src={logoUrl} alt="RedLeads Logo" style={{ height: '28px', marginBottom: '24px' }} />
          <span style={{ 
            fontSize: '10px', 
            fontWeight: '900', 
            textTransform: 'uppercase', 
            letterSpacing: '2px', 
            color: currentContent.tagColor,
            display: 'block',
            marginBottom: '12px'
          }}>
            {currentContent.tag}
          </span>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '900', 
            letterSpacing: '-1px',
            margin: '0 0 12px 0',
            color: '#ffffff',
            lineHeight: '1.2'
          }}>
            {currentContent.title}
          </h1>
        </div>

        <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)', margin: '0 40px' }}></div>

        {/* Body */}
        <div style={{ padding: '40px 30px' }}>
          <div style={{ 
            fontSize: '15px', 
            color: '#dddddd', 
            fontWeight: '500', 
            whiteSpace: 'pre-wrap',
            marginBottom: '40px'
          }}>
            {currentContent.body}
          </div>

          <div style={{ textAlign: 'center' }}>
            <a href={currentContent.ctaUrl} style={{
              display: 'inline-block',
              backgroundColor: '#f25e36',
              color: '#ffffff',
              padding: '16px 40px',
              borderRadius: '12px',
              fontWeight: '900',
              textDecoration: 'none',
              fontSize: '16px',
              boxShadow: '0 10px 20px rgba(242, 94, 54, 0.2)'
            }}>
              {currentContent.cta}
            </a>
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
            padding: '40px 20px', 
            backgroundColor: '#0a0a0a', 
            borderTop: '1px solid rgba(255,255,255,0.05)',
            textAlign: 'center'
        }}>
          <p style={{ fontSize: '12px', color: '#555555', margin: '0 0 12px 0' }}>
            Questions? <a href="mailto:redleads.app@gmail.com" style={{ color: '#888888', textDecoration: 'underline' }}>redleads.app@gmail.com</a>
          </p>
          <p style={{ fontSize: '10px', color: '#333333', margin: '0' }}>
            Built for growth focus by <a href="https://x.com/timjayas" style={{ color: '#555555', textDecoration: 'none' }}>Tim Jayas</a>
          </p>
        </div>
      </div>
    </div>
  );
}
