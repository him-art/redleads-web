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
  const topLeads = leads.slice(0, 10); // Show up to 10
  const firstName = fullName ? fullName.split(' ')[0] : 'there';
  const siteUrl = 'https://redleads.app'; // Fixed to production
  const logoUrl = `${siteUrl}/redleads-logo-white.png`;

  return (
    <div style={{
      backgroundColor: '#050505',
      color: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      padding: '40px 10px',
      lineHeight: '1.6'
    }}>
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
        <div style={{ padding: '40px 30px 20px 30px', textAlign: 'center' }}>
          <img src={logoUrl} alt="RedLeads Logo" style={{ height: '28px', marginBottom: '24px' }} />
          <span style={{ 
            fontSize: '10px', 
            fontWeight: '900', 
            textTransform: 'uppercase', 
            letterSpacing: '2px', 
            color: '#f25e36',
            display: 'block',
            marginBottom: '12px'
          }}>
            Daily Intelligence
          </span>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '900', 
            letterSpacing: '-1px',
            margin: '0 0 12px 0',
            color: '#ffffff',
            lineHeight: '1.2'
          }}>
            {leads.length} New Opportunities
          </h1>
          <p style={{ 
            fontSize: '14px', 
            color: '#888888', 
            margin: '0',
            fontWeight: '500'
          }}>
            Top conversations for {firstName} from the last 24 hours.
          </p>
        </div>

        <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)', margin: '0 40px' }}></div>

        {/* Lead List - VERTICAL STACK FOR MOBILE */}
        <div style={{ padding: '30px 20px' }}>
          <div style={{ marginBottom: '32px' }}>
            {topLeads.map((lead) => (
              <div key={lead.id} style={{ 
                backgroundColor: 'rgba(255,255,255,0.02)', 
                padding: '20px', 
                borderRadius: '16px', 
                border: '1px solid rgba(255,255,255,0.05)',
                marginBottom: '16px',
                display: 'block' // Ensures vertical stacking on all clients
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ 
                    fontSize: '11px', 
                    fontWeight: 'bold', 
                    color: '#f25e36', 
                    textTransform: 'uppercase',
                    marginRight: '10px'
                  }}>
                    r/{lead.subreddit}
                  </span>
                  <span style={{ 
                    fontSize: '10px', 
                    fontWeight: '900', 
                    color: lead.match_score >= 0.9 ? '#22c55e' : '#888',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    {lead.match_score >= 0.9 ? '🔥 High Match' : 'Neutral Match'}
                  </span>
                </div>
                <div style={{ marginBottom: '16px' }}>
                    <span style={{ 
                        color: '#ffffff', 
                        fontWeight: '700', 
                        fontSize: '16px', 
                        display: 'block',
                        lineHeight: '1.4'
                    }}>
                        {lead.title}
                    </span>
                </div>
                <a 
                  href={`${siteUrl}/dashboard?id=${lead.id}`}
                  style={{ 
                    display: 'inline-block',
                    color: '#f25e36', 
                    textDecoration: 'none', 
                    fontWeight: '800', 
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                >
                  View Opportunity &rarr;
                </a>
              </div>
            ))}
          </div>

          {leads.length > 10 && (
            <p style={{ textAlign: 'center', color: '#666', fontSize: '13px', marginBottom: '32px' }}>
              + {leads.length - 10} more opportunities found by your scanner.
            </p>
          )}

          {/* Expert Tip */}
          <div style={{ 
            backgroundColor: 'rgba(242, 94, 54, 0.05)', 
            border: '1px solid rgba(242, 94, 54, 0.1)', 
            borderRadius: '16px', 
            padding: '24px',
            marginBottom: '40px'
          }}>
            <h3 style={{ fontSize: '11px', fontWeight: '900', color: '#f25e36', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 12px 0' }}>
              Reddit Expert Tip
            </h3>
            <p style={{ fontSize: '14px', color: '#ffffff', fontWeight: '500', margin: 0, fontStyle: 'italic' }}>
              "The best comments don't sell; they consult. Answer the user's question first, then mention your product as a resource."
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <a href={`${siteUrl}/dashboard`} style={{
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
              Open Dashboard
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
            Questions? <a href="mailto:Redleads.app@gmail.com" style={{ color: '#888888', textDecoration: 'underline' }}>Redleads.app@gmail.com</a>
          </p>
          <p style={{ fontSize: '10px', color: '#333333', margin: '0' }}>
            Built for growth focus by <a href="https://x.com/timjayas" style={{ color: '#555555', textDecoration: 'none' }}>Tim Jayas</a>
          </p>
        </div>
      </div>
      
      <p style={{ 
        textAlign: 'center', 
        fontSize: '11px', 
        color: '#444444', 
        marginTop: '32px' 
      }}>
        RedLeads.app — Get your First 100 Leads on Reddit. <br/>
        You can adjust your notification frequency in your dashboard.
      </p>
    </div>
  );
}
