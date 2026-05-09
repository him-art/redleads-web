const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkDigestStats() {
  console.log('Checking Daily Digest stats for last 24 hours...');

  // ISO string for 24 hours ago
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data, error, count } = await supabase
    .from('email_logs')
    .select('*', { count: 'exact' })
    .ilike('subject', '%New Opportunities%')
    .gt('sent_at', yesterday);

  if (error) {
    console.error('Error querying email_logs:', error);
    return;
  }

  console.log(`\n📊 Total Digests Sent (last 24h): ${count}`);
  
  if (data && data.length > 0) {
    console.log('\nRecipients:');
    data.forEach(log => console.log(`- ${log.to_email} (${log.subject})`));
  } else {
    console.log('No digest emails found in the last 24 hours.');
  }
}

checkDigestStats();
