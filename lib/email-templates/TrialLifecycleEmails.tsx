import * as React from 'react';

interface TrialLifecycleEmailProps {
  fullName: string;
  stage: 'day1' | 'day2' | 'day3';
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

  const content = {
    day1: {
      preheader: `Your first leads for ${productName} are ready.`,
      tag: 'New Leads',
      tagColor: '#10b981', // Green
      title: 'Your first leads are ready 👀',
      body: `Hi ${firstName},\n\nWe just finished scanning Reddit for mentions of ${productName}. We found ${leadCount} potential customers today alone.\n\nYour top match is currently in r/${topSubreddit}. On Reddit, the first responder usually wins the deal. Log in now and use AI Reply to engage them before your competitors do.\n\nOpportunities like these cool off in minutes, not hours. Don't leave them waiting.`,
      cta: 'View My Leads',
      ctaUrl: `${siteUrl}/dashboard?utm_source=lifecycle&utm_medium=email&utm_campaign=hour1_leads`
    },
    day2: {
      preheader: `${leadCount} new leads were just found. Don't miss out.`,
      tag: 'Urgent Alert',
      tagColor: '#f59e0b', // Yellow/Orange
      title: 'You\'re missing leads right now',
      body: `Hi ${firstName},\n\nSince you signed up, ${leadCount} more people on Reddit have asked for recommendations that match ${productName}.\n\nEvery hour you wait is a missed opportunity to grow your revenue. Log in now to claim these leads and secure your lifetime access before the current early-bird pricing expires.`,
      cta: 'Secure My Leads',
      ctaUrl: `${siteUrl}/pricing?utm_source=lifecycle&utm_medium=email&utm_campaign=day2_missing`
    },
    day3: {
      preheader: 'Your trial ends tomorrow. Keep the leads flowing.',
      tag: 'Final Call',
      tagColor: '#ef4444', // Red
      title: 'Action Required: Your trial ends today',
      body: `Hi ${firstName},\n\nYour full access to RedLeads expires in less than 24 hours.\n\nAfter today, your dashboard will be locked and your lead stream will stop. You'll lose the unfair advantage of having an AI find your customers for you 24/7.\n\nLock in your lifetime access now to keep your pipeline full and never worry about lead gen again.`,
      cta: 'Get Lifetime Access',
      ctaUrl: `${siteUrl}/pricing?utm_source=lifecycle&utm_medium=email&utm_campaign=day3_expiry`
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
