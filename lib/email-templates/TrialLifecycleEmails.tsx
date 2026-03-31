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
      preheader: `Your Reddit scanner is now live and searching for ${productName} leads.`,
      tag: 'Scanner Activated 🛰️',
      tagColor: '#10b981',
      title: `Your first ${leadCount} leads are already waiting 👀`,
      body: (
        <>
          <p>Hi {firstName},</p>
          <p>I'm Tim, the founder of RedLeads. I built this tool to automate the exact process I used to get my first 100 customers—without spending all day on Reddit.</p>
          <p>While you were setting up, our scanner was already working. We've already flagged <strong>{leadCount} people</strong> who are actively looking for what you offer with <strong>{productName}</strong>.</p>
          <p>On Reddit, the first person to provide value usually wins the customer. Click below to see your initial leads and use <strong>AI Reply</strong> to engage them before a competitor does.</p>
        </>
      ),
      cta: 'See My First Leads →',
      ctaUrl: dashboardUrl,
    },
    day2: { // Legacy - skipping in worker
      preheader: `${leadCount} more leads just came in. Don't leave them cold.`,
      tag: 'Urgent Alert',
      tagColor: '#f59e0b',
      title: "You're missing leads right now",
      body: (
        <>
          <p>Hi {firstName},</p>
          <p>Since you signed up, <strong>{leadCount} more posts</strong> have appeared on Reddit where people are asking about exactly what {productName} does.</p>
        </>
      ),
      cta: 'Claim My Leads →',
      ctaUrl: dashboardUrl,
    },
    day3: {
      preheader: 'The secret to winning Reddit leads: The "Helping Hook".',
      tag: 'Growth Lab 🧪',
      tagColor: '#8b5cf6',
      title: 'The "Helping Hook" (Don\'t sell, help)',
      body: (
        <>
          <p>Hi {firstName},</p>
          <p>Most founders fail on Reddit because they sound like a salesperson. Here is the secret: <strong>Provide 90% value, 10% link.</strong></p>
          <p>I call this the <strong>Helping Hook</strong>. Instead of saying "buy my tool," try: <i>"I actually dealt with this exact issue last month. What worked for me was X. I actually built a small tool to automate this if you want to check it out."</i></p>
          <p>Our **AI Reply** is trained on this exact framework. You have <strong>4 days left</strong> in your trial—go use it to turn one of your leads into a conversation today.</p>
        </>
      ),
      cta: 'Try the Helping Hook →',
      ctaUrl: dashboardUrl,
    },
    day4: { // Legacy - skipping in worker
      preheader: 'How one founder closed their first Reddit customer in 3 days.',
      tag: 'Success Story',
      tagColor: '#8b5cf6',
      title: 'From signup to customer in 3 days',
      body: (
        <>
          <p>Hi {firstName},</p>
          <p>Founders who reply to Reddit leads within 24 hours of getting them **close customers 3x faster** than those who batch it weekly.</p>
        </>
      ),
      cta: 'Reply to a Lead Now →',
      ctaUrl: dashboardUrl,
    },
    day5: {
      preheader: 'One reply. One customer. $1,200 in revenue.',
      tag: 'ROI Case Study 📈',
      tagColor: '#0ea5e9',
      title: 'The ROI of a single reply',
      body: (
        <>
          <p>Hi {firstName},</p>
          <p>We just passed the 5-day mark. I wanted to share why RedLeads users usually stick around for years after their trial.</p>
          <p>One of our users recently shared that they spent 30 seconds using <strong>AI Reply</strong> on a lead we found in r/SaaS. That one reply led to a demo, which led to a <strong>$1,200/year contract</strong>.</p>
          <p>RedLeads costs $19/mo. If it finds you just <strong>one customer per year</strong>, it has already paid for itself 5x over.</p>
          <p>You have <strong>{leadCount} leads</strong> waiting in your dashboard. Which one is your next customer?</p>
        </>
      ),
      cta: 'Find My Next Customer →',
      ctaUrl: dashboardUrl,
    },
    day6: {
      preheader: `High-intent buy signals detected in r/${topSubreddit}.`,
      tag: 'Intense Interest 🔥',
      tagColor: '#f25e36',
      title: `Buying signals hit r/${topSubreddit}`,
      body: (
        <>
          <p>Hi {firstName},</p>
          <p>Our scanner just flagged <strong>{leadCount} posts</strong> that are "High Intent." These aren't casual chats—these are people explicitly asking for a recommendation for a solution like <strong>{productName}</strong>.</p>
          <p>Your trial ends tomorrow. Once it expires, your dashboard access will lock and these leads will go to your competitors instead.</p>
          <p>Don't leave easy revenue on the table. Reply to these final leads today.</p>
        </>
      ),
      cta: 'Claim Final Leads →',
      ctaUrl: dashboardUrl,
    },
    day7: {
      preheader: 'Final 24 hours. Your lead stream is about to stop.',
      tag: 'Personal Note ✉️',
      tagColor: '#ef4444',
      title: 'Should I keep your scanner running?',
      body: (
        <>
          <p>Hi {firstName},</p>
          <p>Your 7-day trial ends in exactly 24 hours. Tomorrow morning, your dashboard goes dark and we'll stop monitoring Reddit for <strong>{productName}</strong>.</p>
          <p>I'd love to keep it running for you. Upgrading to a Starter plan is just $19/mo—less than the cost of a single lunch—to keep your lead machine running 24/7.</p>
          <p><strong>Quick question:</strong> If you haven't upgraded yet, what's been the biggest hurdle? Hit reply and let me know—I read every email.</p>
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
