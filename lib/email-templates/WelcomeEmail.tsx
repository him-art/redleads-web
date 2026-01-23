import * as React from 'react';

interface WelcomeEmailProps {
  websiteUrl: string;
}

export default function WelcomeEmail({ websiteUrl }: WelcomeEmailProps) {
  return (
    <div style={{ fontFamily: 'sans-serif', lineHeight: '1.6', color: '#1a1a1a' }}>
      <h1>Welcome to RedLeads!</h1>
      <p>Thanks for trusting us with your lead generation.</p>
      
      <p>
        We are configuring our scanners for: <strong>{websiteUrl}</strong>
      </p>

      <p>
        Our AI is now analyzing Reddit conversations 24/7 to find people looking for exactly 
        what you offer.
      </p>

      <h2>What happens next?</h2>
      <ol>
        <li>We identify high-intent conversations relevant to your niche.</li>
        <li>We curate the best opportunities.</li>
        <li>You receive a weekly digest of leads directly to this inbox.</li>
      </ol>

      <p>
        If you want to speed up the process and see leads <em>right now</em>, check out our 
        <a href="https://redleads.com/scanner" style={{ color: '#f25e36' }}> Free Scanner</a>.
      </p>

      <hr style={{ borderColor: '#e5e5e5', margin: '20px 0' }} />
      
      <p style={{ fontSize: '12px', color: '#666' }}>
        RedLeads - Turn Reddit Conversations Into Paying Customers.
      </p>
    </div>
  );
}
