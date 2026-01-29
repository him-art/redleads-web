import * as React from 'react';

interface WelcomeEmailProps {
  fullName: string;
}

export default function WelcomeEmail({ fullName }: WelcomeEmailProps) {
  return (
    <div style={{ fontFamily: 'sans-serif', lineHeight: '1.6', color: '#1a1a1a', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#f25e36', fontSize: '24px', fontWeight: 'black', letterSpacing: '-0.02em' }}>Welcome to RedLeads, {fullName}!</h1>
      <p>Your 3-day full access trial is now active.</p>
      
      <p>
        RedLeads is built to find your next customers on Reddit without you having to lift a finger. 
        Our Sentinel is now ready to begin monitoring your target communities 24/7.
      </p>

      <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '15px', marginTop: '30px' }}>
        <h2 style={{ fontSize: '18px', margin: '0 0 15px 0' }}>Next Steps</h2>
        <ol style={{ paddingLeft: '20px' }}>
          <li style={{ marginBottom: '10px' }}><strong>Configure Tracking</strong>: Head to your Dashboard and set up your keywords and target subreddits.</li>
          <li style={{ marginBottom: '10px' }}><strong>Activate Sentinel</strong>: Once set up, your Sentinel will automatically start surfacing high-intent leads.</li>
          <li style={{ marginBottom: '10px' }}><strong>Direct Engagement</strong>: We'll notify you whenever we find a perfect match.</li>
        </ol>
      </div>

      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <a 
          href="https://redleads.com/dashboard" 
          style={{ 
            backgroundColor: '#f25e36', 
            color: 'white', 
            padding: '16px 32px', 
            borderRadius: '12px', 
            textDecoration: 'none', 
            fontWeight: 'bold',
            display: 'inline-block'
          }}
        >
          Go to Command Center
        </a>
      </div>

      <hr style={{ borderColor: '#e5e5e5', margin: '40px 0' }} />
      
      <p style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>
        RedLeads - Turn Reddit Conversations Into Paying Customers.<br/>
        You are receiving this because you signed up for RedLeads.
      </p>
    </div>
  );
}
