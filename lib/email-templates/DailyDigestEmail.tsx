import * as React from 'react';

interface Lead {
  id: string;
  title: string;
  subreddit: string;
  match_score: number;
}

interface DailyDigestEmailProps {
  fullName: string;
  leads: Lead[];
}

export default function DailyDigestEmail({ fullName, leads }: DailyDigestEmailProps) {
  // Take top 5 leads
  const topLeads = leads.slice(0, 5);

  return (
    <div style={{ fontFamily: 'sans-serif', lineHeight: '1.6', color: '#1a1a1a', maxWidth: '600px', margin: '0 auto', backgroundColor: '#f9f9f9', padding: '20px' }}>
      <div style={{ backgroundColor: '#111', padding: '40px', borderRadius: '24px', color: 'white' }}>
        
        <div style={{ marginBottom: '32px' }}>
            <span style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#f25e36', border: '1px solid rgba(242, 94, 54, 0.3)', padding: '4px 12px', borderRadius: '100px' }}>
                Daily Intelligence
            </span>
            <h1 style={{ fontSize: '24px', fontWeight: '900', margin: '16px 0 8px 0', lineHeight: '1.2' }}>
                {leads.length} New Opportunities
            </h1>
            <p style={{ color: '#999', fontSize: '14px', margin: '0' }}>
                Here are the highest-intent conversations from the past 24 hours.
            </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            {topLeads.map((lead) => (
                <div key={lead.id} style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: '#f25e36', backgroundColor: 'rgba(242, 94, 54, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                            r/{lead.subreddit}
                        </span>
                        <span style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: lead.match_score >= 0.9 ? '#f25e36' : '#999' }}>
                           {lead.match_score >= 0.9 ? '🔥 High Intent' : lead.match_score >= 0.6 ? '⚖️ Medium Intent' : '❄️ Low Intent'}
                        </span>
                    </div>
                    <a 
                        href={`https://redleads.com/dashboard?tab=live`}
                        style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px', display: 'block', marginBottom: '8px' }}
                    >
                        {lead.title}
                    </a>
                </div>
            ))}
        </div>

        {leads.length > 5 && (
            <p style={{ textAlign: 'center', color: '#666', fontSize: '12px', marginBottom: '24px' }}>
                + {leads.length - 5} more leads waiting in your dashboard
            </p>
        )}

        <a 
          href="https://redleads.com/dashboard?tab=live" 
          style={{ 
            backgroundColor: '#f25e36', 
            color: 'white', 
            padding: '16px 32px', 
            borderRadius: '12px', 
            textDecoration: 'none', 
            fontWeight: '900',
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'block',
            textAlign: 'center'
          }}
        >
          Open Dashboard
        </a>
      </div>

      <p style={{ fontSize: '12px', color: '#666', textAlign: 'center', marginTop: '32px' }}>
        RedLeads Daily Digest<br/>
        You can adjust your keyword settings in the dashboard.
      </p>
    </div>
  );
}
