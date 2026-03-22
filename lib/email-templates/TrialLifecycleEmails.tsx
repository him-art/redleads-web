import * as React from 'react';

interface TrialLifecycleEmailProps {
  fullName: string;
  stage: 'day1' | 'day2' | 'day3' | 'day4' | 'day5' | 'day6' | 'day7';
  productName?: string;
  leadCount?: number;
  topSubreddit?: string;
}

export default function TrialLifecycleEmail({ 
  fullName, 
  stage, 
  productName = 'your product', 
  leadCount = 12, 
  topSubreddit = 'SaaS' 
}: TrialLifecycleEmailProps) {
  const firstName = fullName ? fullName.split(' ')[0] : 'there';
  const siteUrl = 'https://redleads.app';
  const logoUrl = `${siteUrl}/redleads-logo-white.png`;
  const dashboardUrl = `${siteUrl}/dashboard?utm_source=lifecycle&utm_medium=email&utm_campaign=${stage}`;
  const pricingUrl = `${siteUrl}/pricing?utm_source=lifecycle&utm_medium=email&utm_campaign=${stage}`;

  const content: Record<string, {
    preheader: string;
    tag: string;
    tagColor: string;
    title: string;
    body: React.ReactNode;
    cta: string;
    ctaUrl: string;
  }> = {
    day1: {
      preheader: `Your first leads for ${productName} are live right now.`,
      tag: 'New Leads Ready',
      tagColor: '#10b981',
      title: `Your first ${leadCount} Reddit leads are ready 👀`,
      body: (
        <>
          <p>Hi {firstName},</p>
          <p>We just scanned Reddit for {productName} and found <strong>{leadCount} people</strong> who could become your customers.</p>
          <p>Your top match is live in <strong>r/{topSubreddit}</strong> right now. The first person to reply wins, and on Reddit, that window is minutes, not hours.</p>
          <p>Click below to see your leads and use AI Reply to engage them before a competitor does.</p>
        </>
      ),
      cta: 'View My Leads Now →',
      ctaUrl: dashboardUrl,
    },
    day2: {
      preheader: `${leadCount} more leads just came in. Don't leave them cold.`,
      tag: 'Urgent Alert',
      tagColor: '#f59e0b',
      title: "You're missing leads right now",
      body: (
        <>
          <p>Hi {firstName},</p>
          <p>Since you signed up, <strong>{leadCount} more posts</strong> have appeared on Reddit where people are asking about exactly what {productName} does.</p>
          <p>These conversations are happening whether you show up or not. The founders who reply early build trust — the ones who wait lose deals.</p>
          <p>Log in and reply to the hottest leads before your trial ends.</p>
        </>
      ),
      cta: 'Claim My Leads →',
      ctaUrl: dashboardUrl,
    },
    day3: {
      preheader: 'Your trial ends tomorrow. Keep the leads flowing.',
      tag: 'Final Call',
      tagColor: '#ef4444',
      title: 'Your trial ends today ⏰',
      body: (
        <>
          <p>Hi {firstName},</p>
          <p>Your full access to RedLeads expires in <strong>less than 24 hours</strong>.</p>
          <p>After tomorrow, your dashboard locks and your lead stream stops. You will lose live monitoring of r/{topSubreddit} and the other subreddits where your customers are asking questions right now.</p>
          <p><strong>{leadCount} leads</strong> are sitting in your dashboard. Don't let them go cold.</p>
        </>
      ),
      cta: 'Upgrade Before It Expires →',
      ctaUrl: pricingUrl,
    },
    day4: {
      preheader: 'How one founder closed their first Reddit customer in 3 days.',
      tag: 'Success Story',
      tagColor: '#8b5cf6',
      title: 'From signup to customer in 3 days',
      body: (
        <>
          <p>Hi {firstName},</p>
          <p>Here is something we have seen repeatedly: founders who reply to Reddit leads within 24 hours of getting them <strong>close customers 3x faster</strong> than those who batch it weekly.</p>
          <p>Why? Because Reddit is a real-time platform. When someone asks "what tool should I use for X?" you have a 2-hour window before the thread goes quiet.</p>
          <p>RedLeads surfaces that moment. <strong>AI Reply</strong> helps you say the right thing. And you stay safe from Reddit's anti-spam filters.</p>
          <p>Your trial is still active. Go reply to one lead today.</p>
        </>
      ),
      cta: 'Reply to a Lead Now →',
      ctaUrl: dashboardUrl,
    },
    day5: {
      preheader: 'What happens after you reply.',
      tag: 'Social Proof',
      tagColor: '#0ea5e9',
      title: 'What founders are saying',
      body: (
        <>
          <p>Hi {firstName},</p>
          <p>A few things we hear from RedLeads users:</p>
          <div style={{ padding: '16px', borderLeft: '3px solid #0ea5e9', backgroundColor: 'rgba(14, 165, 233, 0.05)', marginBottom: '16px' }}>
            <p style={{ margin: '0 0 12px 0', fontStyle: 'italic' }}>"I replied to 3 posts in r/SaaS my first week. One of them became a paying customer."</p>
            <p style={{ margin: '0 0 12px 0', fontStyle: 'italic' }}>"I was spending 2 hours a day manually searching Reddit. RedLeads does it in seconds."</p>
            <p style={{ margin: 0, fontStyle: 'italic' }}>"The AI Reply feature is what got me. I was terrified of sounding spammy. It doesn't."</p>
          </div>
          <p>You are still in your trial. Today is a good day to go turn one of your <strong>{leadCount} leads</strong> into a real conversation.</p>
        </>
      ),
      cta: 'View My Dashboard →',
      ctaUrl: dashboardUrl,
    },
    day6: {
      preheader: `High-intent leads just landed in r/${topSubreddit}. Don't miss them.`,
      tag: '🔥 Hot Leads Alert',
      tagColor: '#f25e36',
      title: `High-intent posts just hit r/${topSubreddit}`,
      body: (
        <>
          <p>Hi {firstName},</p>
          <p>We scanned Reddit today and flagged <strong>{leadCount} posts</strong> where people are actively looking for solutions like {productName}.</p>
          <p>These are NOT brand mentions or casual discussions. These are people saying "I need X, what do you recommend?" — the <strong>highest-intent buying signal</strong> on the internet.</p>
          <p>Your trial ends very soon. Use AI Reply to engage at least one of these today.</p>
        </>
      ),
      cta: 'See Hot Leads →',
      ctaUrl: dashboardUrl,
    },
    day7: {
      preheader: 'Last 24 hours. Then your leads stop.',
      tag: 'Final Warning',
      tagColor: '#ef4444',
      title: 'Access locks in 24 hours',
      body: (
        <>
          <p>Hi {firstName},</p>
          <p>This is the last email before your RedLeads trial ends.</p>
          <p>Tomorrow, your dashboard goes dark. Your lead stream stops. The <strong>{leadCount} leads</strong> we found for {productName} on <strong>r/{topSubreddit}</strong> will sit unclaimed, and a competitor will reply to them instead.</p>
          <p>Upgrading takes 60 seconds. A Growth plan is $29/mo — less than a single customer acquisition from paid ads.</p>
          <p>Don't let 7 days of setup go to waste.</p>
        </>
      ),
      cta: 'Keep My Access Live →',
      ctaUrl: pricingUrl,
    },
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

        <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)', margin: '0 40px' }} />

        {/* Body */}
        <div style={{ padding: '40px 30px' }}>
          <div style={{ 
            fontSize: '15px', 
            color: '#dddddd', 
            fontWeight: '500', 
            marginBottom: '40px',
            lineHeight: '1.7'
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
            Built for growth by <a href="https://x.com/timjayas" style={{ color: '#555555', textDecoration: 'none' }}>Tim Jayas</a>
          </p>
        </div>
      </div>
    </div>
  );
}
