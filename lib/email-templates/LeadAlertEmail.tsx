import * as React from 'react';

interface LeadAlertEmailProps {
  fullName: string;
  leadTitle: string;
  subreddit: string;
  matchScore: number;
}

export default function LeadAlertEmail({ fullName, leadTitle, subreddit, matchScore }: LeadAlertEmailProps) {
  return (
    <div style={{ fontFamily: 'sans-serif', lineHeight: '1.6', color: '#1a1a1a', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#111', padding: '40px', borderRadius: '24px', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <span style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#f25e36', border: '1px solid rgba(242, 94, 54, 0.3)', padding: '4px 12px', borderRadius: '100px' }}>
                High Intent Lead Found
            </span>
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: '900', margin: '0 0 16px 0', lineHeight: '1.2' }}>
            "{leadTitle}"
        </h1>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
            <div style={{ flex: '1' }}>
                <p style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', fontWeight: 'bold', margin: '0 0 4px 0' }}>Community</p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0' }}>r/{subreddit}</p>
            </div>
            <div style={{ flex: '1' }}>
                <p style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', fontWeight: 'bold', margin: '0 0 4px 0' }}>Match Score</p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#f25e36', margin: '0' }}>{matchScore}%</p>
            </div>
        </div>

        <p style={{ color: '#999', fontSize: '14px', marginBottom: '32px' }}>
            Hello {fullName}, your RedLeads Sentinel just identified a high-intent conversation on Reddit that matches your product profile perfectly.
        </p>

        <a 
          href="https://redleads.com/dashboard?tab=live" 
          style={{ 
            backgroundColor: '#f25e36', 
            color: 'white', 
            padding: '18px 32px', 
            borderRadius: '16px', 
            textDecoration: 'none', 
            fontWeight: '900',
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'block',
            textAlign: 'center'
          }}
        >
          View Lead Context
        </a>
      </div>

      <hr style={{ borderColor: '#e5e5e5', margin: '40px 0' }} />
      
      <p style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>
        RedLeads - High Intensity Reddit Discovery.<br/>
        You can adjust your notification frequency in your dashboard settings.
      </p>
    </div>
  );
}
