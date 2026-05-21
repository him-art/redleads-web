import * as React from 'react';

interface FeedbackEmailProps {
  firstName: string;
  tier: 'lifetime' | 'starter' | 'trial';
}

export default function FeedbackEmail({ firstName, tier }: FeedbackEmailProps) {
  const siteUrl = 'https://redleads.app';
  const logoUrl = `${siteUrl}/redleads-logo-white.png`;

  let headline = "Quick question about your RedLeads toolkit";
  let greetingText = `Hi ${firstName}, Tim here from RedLeads.`;
  let introParagraph = `We’ve recently expanded RedLeads from just a scanner into a complete growth toolkit. You now have three core engines at your disposal:`;
  let question = "Which of these three are you getting the most value out of right now?";
  let subtext = "(And conversely, if one of them is confusing or falling flat, please let me know that too!). I read every single reply, and your feedback dictates what we build next.";

  if (tier === 'trial') {
    headline = "Are you using the full RedLeads toolkit?";
    introParagraph = `I wanted to check in on your trial. Our goal is to give you everything you need to find your first 100 users, which is why we've built a three-part toolkit:`;
    question = "Have you had a chance to explore all three? If so, which one feels like the biggest game-changer for your workflow?";
    subtext = "If you're feeling stuck on any of them, just hit reply and I'll personally help you get set up.";
  }

  const uniqueId = Math.random().toString(36).substring(7);

  return (
    <html lang="en" style={{ colorScheme: 'dark' }}>
      <head>
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
      </head>
      <body style={{
        backgroundColor: '#0f0f13',
        margin: 0,
        padding: 0,
        WebkitTextSizeAdjust: '100%',
      }}>
        {/* Hidden unique ID to prevent Gmail from collapsing "expanded content" */}
        <div style={{ display: 'none', visibility: 'hidden', opacity: 0, height: 0, width: 0, fontSize: 0 }}>
          Tracking ID: {uniqueId}
        </div>
        
        <div style={{
          backgroundColor: '#0f0f13',
          color: '#ffffff',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          padding: '40px 10px',
          lineHeight: '1.6'
        }}>
          <div style={{
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
              <img src={logoUrl} alt="RedLeads Logo" style={{ height: '24px', marginBottom: '24px' }} />
              <h1 style={{ 
                fontSize: '22px', 
                fontWeight: '900', 
                letterSpacing: '-0.5px',
                margin: '0 0 12px 0',
                color: '#ffffff',
                lineHeight: '1.2'
              }}>
                {headline}
              </h1>
              <p style={{ 
                fontSize: '15px', 
                color: '#888888', 
                margin: '0',
                fontWeight: '500'
              }}>
                {greetingText}
              </p>
            </div>

            <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)', margin: '0 40px' }}></div>

            {/* Content */}
            <div style={{ padding: '30px 40px' }}>
              <p style={{ fontSize: '15px', color: '#cccccc', marginBottom: '16px', fontWeight: '400' }}>
                {introParagraph}
              </p>

              <ol style={{ fontSize: '15px', color: '#ffffff', fontWeight: '500', marginBottom: '24px', paddingLeft: '24px' }}>
                <li style={{ marginBottom: '8px' }}>Your automated <strong>Daily Digest</strong></li>
                <li style={{ marginBottom: '8px' }}>The live <strong>Power Search</strong></li>
                <li style={{ marginBottom: '8px' }}>Our new personalized <strong>"First 100 Users" Guide</strong></li>
              </ol>
              
              <div style={{ 
                backgroundColor: 'rgba(242, 94, 54, 0.03)', 
                padding: '24px', 
                borderRadius: '16px', 
                border: '1px solid rgba(242, 94, 54, 0.1)',
                marginBottom: '24px'
              }}>
                <p style={{ fontSize: '17px', fontWeight: '700', color: '#f25e36', margin: 0, lineHeight: '1.4' }}>
                  {question}
                </p>
              </div>

              <p style={{ fontSize: '15px', color: '#cccccc', marginBottom: '32px' }}>
                {subtext}
              </p>

              <div style={{ marginTop: '40px' }}>
                <p style={{ margin: '0', fontSize: '16px', fontWeight: '700', color: '#ffffff' }}>Tim Jayas</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#888888' }}>Founder, RedLeads.app</p>
              </div>
            </div>

            {/* Footer */}
            <div style={{ 
                padding: '30px 20px', 
                backgroundColor: '#0a0a0a', 
                borderTop: '1px solid rgba(255,255,255,0.05)',
                textAlign: 'center'
            }}>
              <p style={{ fontSize: '11px', color: '#444444', margin: '0' }}>
                RedLeads &bull; Get your first 100 leads on Reddit
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
