import * as React from 'react';

interface PremiumOnboardingEmailProps {
  fullName?: string;
  websiteUrl?: string;
  trialExpiryDate?: string; // Format: "February 12th"
  daysLeft?: number;
  step?: 'welcome' | 'expert-secret' | 'founder-check' | 'case-study' | 'trial-ending';
}

export default function PremiumOnboardingEmail({ 
    fullName, 
    websiteUrl, 
    trialExpiryDate,
    daysLeft = 3,
    step = 'welcome' 
}: PremiumOnboardingEmailProps) {
  
  const firstName = fullName ? fullName.split(' ')[0] : 'there';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://redleads.app';
  const logoUrl = `${siteUrl}/redleads-logo-white.png`;
  
  const content = {
    welcome: {
        headline: "RedLeads: Step 1 to your first 100 leads.",
        subheadline: `Welcome, ${firstName}. Your 3-day trial is active.`,
        body: `I'm Tim. I built RedLeads to automate the exact process I used to get my first 100 customers. Your scanner is now live and searching for high-intent conversations about ${websiteUrl || 'your niche'}.`,
        cta: "See Your First Leads",
        link: `${siteUrl}/dashboard`,
        showTrialBox: true
    },
    'expert-secret': {
        headline: "The 'Expert' secret to Reddit leads.",
        subheadline: "It's about Intent, not just Keywords.",
        body: `Most people treat Reddit like a search engine. Big mistake. High-intent leads don't use keywords like "buy". They ask: "Does anyone know how to..." or "I'm struggling with...". That's exactly what our AI looks for.`,
        cta: "Refine Your Keywords",
        link: `${siteUrl}/dashboard`
    },
    'founder-check': {
        headline: `How is it going, ${firstName}?`,
        subheadline: "A quick personal check-in (Trial expires in 24h).",
        body: `I was looking at the dashboard today and wanted to see if you've found any interesting leads for ${websiteUrl || 'your project'}. Your 3-day trial expires tomorrow, so I want to make sure you've seen the value. If you're not seeing the right conversations, reply now—I'll personally help you tweak your scanner.`,
        cta: "Message Tim (Reply to this email)",
        link: `mailto:Redleads.app@gmail.com`
    },
    'case-study': {
        headline: "High Intent = High Conversion.",
        subheadline: "The 'Expert' way to win Reddit leads.",
        body: `Stop selling. Start helping. One of our users recently shared how they secured their first 10 leads in just 48 hours by providing genuine value in the threads RedLeads surfaced. Authentic engagement wins every single time.`,
        cta: "Read the Playbook",
        link: `${siteUrl}/blog`
    },
    'trial-ending': {
        headline: "Don't lose your Reddit momentum.",
        subheadline: "Your trial expires in 24 hours.",
        body: `You've discovered some powerful conversations in the last few days. Don't let those leads go cold. Upgrade today to keep your scanner active 24/7 and keep those customers coming in.`,
        cta: "Upgrade Now",
        link: `${siteUrl}/dashboard`
    }
  };

  const activeContent = content[step as keyof typeof content] || content.welcome;

  return (
    <div style={{
      backgroundColor: '#050505',
      color: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      padding: '40px 20px',
      lineHeight: '1.6'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#111111',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
      }}>
        {/* Header/Logo */}
        <div style={{ padding: '40px 40px 20px 40px', textAlign: 'center' }}>
          <img src={logoUrl} alt="RedLeads Logo" style={{ height: '32px', marginBottom: '24px' }} />
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '900', 
            letterSpacing: '-1px',
            margin: '0 0 12px 0',
            color: '#ffffff',
            lineHeight: '1.2'
          }}>
            {activeContent.headline}
          </h1>
          <p style={{ 
            fontSize: '16px', 
            color: '#888888', 
            margin: '0',
            fontWeight: '500'
          }}>
            {activeContent.subheadline}
          </p>
        </div>

        {/* Hero Divider */}
        <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)', margin: '0 40px' }}></div>

        {/* Main Body */}
        <div style={{ padding: '40px' }}>
          <p style={{ fontSize: '15px', color: '#cccccc', margin: '0 0 24px 0' }}>
            {activeContent.body}
          </p>
          
          {(activeContent as any).showTrialBox && (
            <div style={{ 
              backgroundColor: 'rgba(242, 94, 54, 0.05)', 
              border: '1px solid rgba(242, 94, 54, 0.1)', 
              borderRadius: '16px', 
              padding: '24px',
              marginBottom: '32px'
            }}>
              <h3 style={{ fontSize: '12px', fontWeight: '900', color: '#f25e36', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 12px 0' }}>
                Your Trial Access
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#22c55e', borderRadius: '50%' }}></div>
                <span style={{ fontSize: '14px', color: '#ffffff', fontWeight: '600' }}>
                   Unlocked: Unlimited Subreddit Monitoring
                </span>
              </div>
              <p style={{ fontSize: '13px', color: '#888888', margin: 0 }}>
                Your access continues until <strong>{trialExpiryDate || `in ${daysLeft} days`}</strong>.
              </p>
            </div>
          )}

          <div style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.02)', 
            border: '1px solid rgba(255, 255, 255, 0.05)', 
            borderRadius: '16px', 
            padding: '24px',
            marginBottom: '32px'
          }}>
            <h3 style={{ fontSize: '12px', fontWeight: '900', color: '#f25e36', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 12px 0' }}>
              Reddit Expert Tip
            </h3>
            <p style={{ fontSize: '14px', color: '#ffffff', fontWeight: '500', margin: 0 }}>
              "Always upvote before you comment. It shows respect to the community and increases your visibility."
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <a href={activeContent.link} style={{
              display: 'inline-block',
              backgroundColor: '#f25e36',
              color: '#ffffff',
              padding: '16px 32px',
              borderRadius: '12px',
              fontWeight: '900',
              textDecoration: 'none',
              fontSize: '16px'
            }}>
              {activeContent.cta}
            </a>
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
            padding: '40px', 
            backgroundColor: '#0a0a0a', 
            borderTop: '1px solid rgba(255,255,255,0.05)',
            textAlign: 'center'
        }}>
          <p style={{ fontSize: '13px', color: '#555555', margin: '0 0 12px 0' }}>
            Need help? Reach out at <a href="mailto:Redleads.app@gmail.com" style={{ color: '#888888', textDecoration: 'underline' }}>Redleads.app@gmail.com</a>
          </p>
          <p style={{ fontSize: '11px', color: '#333333', margin: '0' }}>
            Built for growth focus by <a href="https://x.com/timjayas" style={{ color: '#555555', textDecoration: 'none' }}>Tim Jayas</a>
          </p>
        </div>
      </div>
      
      <p style={{ 
        textAlign: 'center', 
        fontSize: '11px', 
        color: '#444444', 
        marginTop: '32px' 
      }}>
        RedLeads.app — The scanner for your First 100 Leads. <br/>
        You are receiving this because you're a RedLeads user.
      </p>
    </div>
  );
}
