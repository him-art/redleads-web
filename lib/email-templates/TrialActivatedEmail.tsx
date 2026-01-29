import * as React from 'react';

interface TrialActivatedEmailProps {
  fullName: string;
}

export default function TrialActivatedEmail({ fullName }: TrialActivatedEmailProps) {
  return (
    <div style={{ fontFamily: 'sans-serif', lineHeight: '1.6', color: '#1a1a1a', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ border: '1px solid #e5e5e5', padding: '40px', borderRadius: '24px' }}>
        <h1 style={{ color: '#f25e36', fontSize: '28px', fontWeight: '900', margin: '0 0 16px 0' }}>Your 3-Day Trial is Active! 🚀</h1>
        <p style={{ fontSize: '16px', color: '#444' }}>Hi {fullName},</p>
        <p style={{ fontSize: '16px', color: '#444' }}>
            You've just unlocked full access to the RedLeads Command Center. For the next 3 days, you have the full power of our AI Sentinel at your fingertips.
        </p>

        <div style={{ margin: '32px 0', padding: '24px', backgroundColor: '#fdf2f0', borderRadius: '16px', border: '1px solid #fce4e0' }}>
            <h3 style={{ margin: '0 0 12px 0', color: '#f25e36' }}>What's included in your trial:</h3>
            <ul style={{ margin: '0', paddingLeft: '20px', color: '#666' }}>
                <li style={{ marginBottom: '8px' }}><strong>24/7 Monitoring</strong> of unlimited subreddits.</li>
                <li style={{ marginBottom: '8px' }}><strong>10 Deep Scans</strong> every single day.</li>
                <li style={{ marginBottom: '8px' }}><strong>Instant Notifications</strong> for high-intent matches.</li>
                <li><strong>Lead History</strong> & direct engagement links.</li>
            </ul>
        </div>

        <p style={{ fontSize: '16px', color: '#444' }}>
            Get started by adding your first set of keywords to the Command Center. The more specific you are, the better our AI can find your perfect customers.
        </p>

        <div style={{ marginTop: '40px' }}>
            <a 
            href="https://redleads.com/dashboard" 
            style={{ 
                backgroundColor: '#111', 
                color: 'white', 
                padding: '18px 32px', 
                borderRadius: '16px', 
                textDecoration: 'none', 
                fontWeight: 'bold',
                display: 'block',
                textAlign: 'center'
            }}
            >
            Enter Command Center
            </a>
        </div>
      </div>

      <p style={{ fontSize: '12px', color: '#999', textAlign: 'center', marginTop: '32px' }}>
        RedLeads - Precision Prospecting on Reddit.
      </p>
    </div>
  );
}
