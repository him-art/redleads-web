import * as React from 'react';

interface WelcomeEmailProps {
  email: string;
  plan?: string; // e.g. 'Starter', 'Growth', 'Lifetime'
}

export default function WelcomeEmail({ email, plan = 'Starter' }: WelcomeEmailProps) {
  const firstName = email ? email.split('@')[0] : 'there';
  const siteUrl = 'https://redleads.app';
  const logoUrl = `${siteUrl}/redleads-logo-white.png`;
  const dashboardUrl = `${siteUrl}/dashboard?utm_source=welcome_email&utm_medium=email&utm_campaign=welcome`;
  const settingsUrl = `${siteUrl}/dashboard?tab=settings&utm_source=welcome_email&utm_medium=email&utm_campaign=welcome_setup`;

  const steps = [
    {
      number: '01',
      title: 'Confirm your keywords',
      body: 'We pre-loaded keywords based on your product. Review and refine them in your settings — the more precise, the better your leads.',
      cta: 'Go to Settings',
      href: settingsUrl,
    },
    {
      number: '02',
      title: 'Let the scanner run',
      body: 'Your scanner is already live on Reddit. It monitors thousands of threads 24/7 and scores each one for buyer intent. No action needed.',
      cta: null,
      href: null,
    },
    {
      number: '03',
      title: 'Check tomorrow\'s digest',
      body: 'Within 24 hours you\'ll receive your first daily intelligence report — a ranked list of the highest-intent conversations for you to engage.',
      cta: null,
      href: null,
    },
  ];

  const features = [
    ['🕵️', 'Live Reddit monitoring for your keywords, 24/7'],
    ['🤖', 'AI reply drafts that sound human, not spammy'],
    ['📊', 'Lead scoring — focus only on high-intent buyers'],
    ['📧', 'Daily digest of your top leads, straight to your inbox'],
  ];

  return (
    <html lang="en" style={{ colorScheme: 'dark' }}>
      <head>
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        <style dangerouslySetInnerHTML={{ __html: `
          :root { color-scheme: light dark; }
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
          lineHeight: '1.6',
        }}>
          {/* Preheader — hidden in body, shows in inbox preview */}
          <div style={{ display: 'none', maxWidth: 0, maxHeight: 0, overflow: 'hidden', opacity: 0 }}>
            Your Reddit lead scanner is live. Here&apos;s how to get your first lead today.
          </div>

          <div className="email-container" style={{
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: '#1a1a1a',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
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
                marginBottom: '12px',
              }}>
                {plan} Plan — Active
              </span>
              <h1 style={{
                fontSize: '26px',
                fontWeight: '900',
                letterSpacing: '-1px',
                margin: '0 0 12px 0',
                color: '#ffffff',
                lineHeight: '1.2',
              }}>
                You&apos;re in, {firstName}. 🎉
              </h1>
              <p style={{
                fontSize: '15px',
                color: '#888888',
                margin: '0',
                fontWeight: '500',
              }}>
                Your Reddit lead scanner is now live. Here&apos;s how to get your first lead.
              </p>
            </div>

            <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)', margin: '0 40px' }} />

            {/* 3-step guide */}
            <div style={{ padding: '40px 30px' }}>
              <p style={{
                fontSize: '11px',
                fontWeight: '900',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                color: '#555555',
                marginTop: 0,
                marginBottom: '24px',
              }}>
                Quick Start — 3 Steps
              </p>

              {steps.map((s, i) => (
                <div key={i} style={{
                  display: 'flex',
                  gap: '20px',
                  marginBottom: i < steps.length - 1 ? '28px' : '0',
                  alignItems: 'flex-start',
                }}>
                  {/* Step number */}
                  <div style={{
                    width: '36px',
                    height: '36px',
                    minWidth: '36px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(242, 94, 54, 0.1)',
                    border: '1px solid rgba(242, 94, 54, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: '900',
                    color: '#f25e36',
                    letterSpacing: '0.5px',
                  }}>
                    {s.number}
                  </div>
                  {/* Step content */}
                  <div style={{ flex: 1 }}>
                    <p style={{
                      margin: '0 0 6px 0',
                      fontSize: '14px',
                      fontWeight: '800',
                      color: '#ffffff',
                    }}>
                      {s.title}
                    </p>
                    <p style={{
                      margin: '0 0 10px 0',
                      fontSize: '13px',
                      color: '#888888',
                      fontWeight: '500',
                      lineHeight: '1.6',
                    }}>
                      {s.body}
                    </p>
                    {s.cta && s.href && (
                      <a href={s.href} style={{
                        display: 'inline-block',
                        fontSize: '11px',
                        fontWeight: '800',
                        color: '#f25e36',
                        textDecoration: 'none',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                      }}>
                        {s.cta} &rarr;
                      </a>
                    )}
                  </div>
                </div>
              ))}

              {/* CTA */}
              <div style={{ textAlign: 'center', margin: '40px 0 0 0' }}>
                <a href={dashboardUrl} style={{
                  display: 'inline-block',
                  backgroundColor: '#f25e36',
                  color: '#ffffff',
                  padding: '18px 48px',
                  borderRadius: '12px',
                  fontWeight: '900',
                  textDecoration: 'none',
                  fontSize: '15px',
                  letterSpacing: '0.5px',
                  boxShadow: '0 10px 20px rgba(242, 94, 54, 0.25)',
                }}>
                  Open My Dashboard &rarr;
                </a>
              </div>
            </div>

            {/* Feature grid */}
            <div style={{
              margin: '0 30px 30px',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.07)',
              overflow: 'hidden',
            }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ margin: 0, fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: '#555555' }}>
                  What&apos;s running for you right now
                </p>
              </div>
              {features.map(([icon, text]) => (
                <div key={text as string} style={{
                  padding: '14px 24px',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}>
                  <span style={{ fontSize: '18px' }}>{icon}</span>
                  <span style={{ fontSize: '13px', color: '#cccccc', fontWeight: '600' }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Money-back guarantee */}
            <div style={{
              margin: '0 30px 30px',
              backgroundColor: 'rgba(16, 185, 129, 0.06)',
              border: '1px solid rgba(16, 185, 129, 0.15)',
              borderRadius: '16px',
              padding: '16px 20px',
              textAlign: 'center',
            }}>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: '700', color: '#10b981' }}>
                🛡️ 7-day money-back guarantee — if RedLeads doesn&apos;t bring you leads in your first week, email us for a full refund. No questions.
              </p>
            </div>

            {/* Footer */}
            <div style={{
              padding: '30px 20px',
              backgroundColor: '#0a0a0a',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: '12px', color: '#555555', margin: '0 0 8px 0' }}>
                Questions? Reply to this email or write to{' '}
                <a href="mailto:redleads.app@gmail.com" style={{ color: '#888888', textDecoration: 'underline' }}>
                  redleads.app@gmail.com
                </a>
              </p>
              <p style={{ fontSize: '10px', color: '#333333', margin: '0' }}>
                Built for growth by{' '}
                <a href="https://x.com/timjayas" style={{ color: '#555555', textDecoration: 'none' }}>
                  Tim Jayas
                </a>
              </p>
            </div>
          </div>

          <p style={{
            textAlign: 'center',
            fontSize: '11px',
            color: '#444444',
            marginTop: '32px',
          }}>
            RedLeads.app — Get your first customers from Reddit.
          </p>
        </div>
      </body>
    </html>
  );
}
