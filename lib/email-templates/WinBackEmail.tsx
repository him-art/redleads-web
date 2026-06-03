import * as React from 'react';

interface WinBackEmailProps {
  fullName: string;
  LEADCOUNT: number;
  topSubreddit: string;
  productName?: string;
  daysSinceExpiry?: number;
  unsubscribeUrl?: string;
}

export default function WinBackEmail({
  fullName,
  LEADCOUNT,
  topSubreddit,
  productName = 'your product',
  daysSinceExpiry = 3,
  unsubscribeUrl
}: WinBackEmailProps) {
  const firstName = fullName ? fullName.split(' ')[0] : 'there';
  const siteUrl = 'https://redleads.app';
  const logoUrl = `${siteUrl}/redleads-logo-white.png`;
  const ctaUrl = `${siteUrl}/pricing?utm_source=winback&utm_medium=email&utm_campaign=expired_preview`;

  return (
    <html lang="en" style={{ colorScheme: 'dark' }}>
      <head>
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            color-scheme: light dark;
          }
          @media (prefers-color-scheme: light) {
            body { background-color: #0f0f13 !important; color: #ffffff !important; }
            .email-container { background-color: #1a1a1a !important; }
          }
        ` }} />
      </head>
      <body style={{
        backgroundColor: '#0f0f13',
        margin: 0,
        padding: 0,
        WebkitTextSizeAdjust: '100%',
      }}>
        <div style={{
          backgroundColor: '#0f0f13',
          color: '#ffffff',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          padding: '40px 10px',
          lineHeight: '1.6'
        }}>
          {/* Preheader */}
          <div style={{ display: 'none', maxWidth: 0, maxHeight: 0, overflow: 'hidden', opacity: 0 }}>
            Claim 40% off to unlock your {LEADCOUNT} leads.
          </div>

          <div className="email-container" style={{
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: '#1a1a1a',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
          }}>
        {/* Header */}
        <div style={{ padding: '40px 30px', textAlign: 'center' }}>
          <img src={logoUrl} alt="RedLeads" style={{ height: '28px', marginBottom: '24px' }} />
          <span style={{
            fontSize: '10px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: '#f25e36',
            display: 'block',
            marginBottom: '12px'
          }}>
            Exclusive Offer
          </span>
          <h1 style={{
            fontSize: '26px',
            fontWeight: '900',
            letterSpacing: '-1px',
            margin: '0 0 12px 0',
            color: '#ffffff',
            lineHeight: '1.2'
          }}>
            Get 40% off your first month<br />with code LEADCOUNT
          </h1>
        </div>

        <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)', margin: '0 40px' }} />

        {/* Body */}
        <div style={{ padding: '40px 30px' }}>

          {/* Lead count callout box */}
          <div style={{
            backgroundColor: 'rgba(242, 94, 54, 0.08)',
            border: '1px solid rgba(242, 94, 54, 0.2)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
            textAlign: 'center'
          }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#888888', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Leads collected since your preview ended
            </p>
            <p style={{ margin: '0', fontSize: '48px', fontWeight: '900', color: '#f25e36', letterSpacing: '-2px' }}>
              {LEADCOUNT}
            </p>
            <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#888888', fontWeight: '600' }}>
              Top source: <strong style={{ color: '#ffffff' }}>r/{topSubreddit}</strong>
            </p>
          </div>

          <div style={{
            fontSize: '15px',
            color: '#dddddd',
            fontWeight: '500',
            marginBottom: '32px',
            lineHeight: '1.8'
          }}>
            <p>Hey {firstName},</p>
            <p>
              Your RedLeads preview ended {daysSinceExpiry} day{daysSinceExpiry !== 1 ? 's' : ''} ago, but we kept scanning for you.
            </p>
            <p>
              In that time, <strong style={{ color: '#ffffff' }}>{LEADCOUNT}+ people posted in r/{topSubreddit}</strong> asking questions that {productName} can answer.
            </p>
            <p>
              We want you to be able to reply to them. Claim an exclusive <strong style={{ color: '#f25e36' }}>40% discount</strong> on any paid plan with coupon code <strong style={{ color: '#ffffff' }}>LEADCOUNT</strong> at checkout.
            </p>
            <p>
              Plus, you are fully protected by our <strong style={{ color: '#10b981' }}>7-day money-back guarantee</strong>. If RedLeads doesn't bring you customers in your first week, just email us for a full, hassle-free refund.
            </p>
          </div>

          {/* CTA Button */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <a href={ctaUrl} style={{
              display: 'inline-block',
              backgroundColor: '#f25e36',
              color: '#ffffff',
              padding: '18px 48px',
              borderRadius: '12px',
              fontWeight: '900',
              textDecoration: 'none',
              fontSize: '15px',
              letterSpacing: '0.5px',
              boxShadow: '0 10px 20px rgba(242, 94, 54, 0.25)'
            }}>
              Claim My 40% Discount →
            </a>
          </div>

          <p style={{ textAlign: 'center', fontSize: '12px', color: '#555555', margin: '0' }}>
            Includes 7-day money-back guarantee • Cancel anytime
          </p>
        </div>

        {/* What you get reminder */}
        <div style={{
          margin: '0 30px 30px',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.07)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ margin: 0, fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: '#555555' }}>
              What you get back
            </p>
          </div>
          {[
            ['🕵️', 'Live Reddit monitoring for your keywords, 24/7'],
            ['🤖', 'AI-generated replies that sound human, not spammy'],
            ['🛡️', 'Anti-ban safety engine (no account risk)'],
            ['📧', 'Daily digest of your top leads, straight to your inbox'],
          ].map(([icon, text]) => (
            <div key={text as string} style={{ padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '18px' }}>{icon}</span>
              <span style={{ fontSize: '13px', color: '#cccccc', fontWeight: '600' }}>{text}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '30px 20px',
          backgroundColor: '#0a0a0a',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '12px', color: '#555555', margin: '0 0 8px 0' }}>
            Questions? <a href="mailto:redleads.app@gmail.com" style={{ color: '#888888', textDecoration: 'underline' }}>redleads.app@gmail.com</a>
          </p>
          <p style={{ fontSize: '10px', color: '#333333', margin: '0' }}>
            Built for growth by <a href="https://x.com/timjayas" style={{ color: '#555555', textDecoration: 'none' }}>Tim Jayas</a>
          </p>
          {unsubscribeUrl && (
            <p style={{ fontSize: '10px', color: '#444444', margin: '12px 0 0 0' }}>
              No longer want to receive these emails?{' '}
              <a href={unsubscribeUrl} style={{ color: '#666666', textDecoration: 'underline' }}>
                Unsubscribe
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
      </body>
    </html>
  );
}
