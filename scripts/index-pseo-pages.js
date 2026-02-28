/**
 * RedLeads pSEO Indexing Script
 * ----------------------------
 * This script uses the Google Indexing API to notify Google of new pSEO landing pages.
 * It reads from our solutions data and master subreddits to generate all URLs.
 * 
 * Requirements:
 * 1. googleapis (npm install googleapis)
 * 2. service-account.json (Download from Google Cloud Console)
 * 3. Search Console Owner access for the Service Account email.
 */

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

// Configuration
const SERVICE_ACCOUNT_FILE = path.join(__dirname, '../service-account.json');
const MASTER_SUBREDDITS_FILE = path.join(__dirname, '../data/master-subreddits.json');
const BASE_URL = 'https://www.redleads.app';
const INDEXED_CACHE_FILE = path.join(__dirname, 'indexed-cache.json');

// Current solutions (matching data.ts slugs)
const solutionSlugs = [
  'saas',
  'ai-wrappers',
  'marketing-agencies',
  'mobile-apps',
  'content-creators',
  'crypto-web3',
  'real-estate',
  'e-commerce',
  'validate-saas-idea',
  'get-first-users',
  'competitor-alternatives',
  'viral-saas-distribution',
  'agencies' // Added agencies
];

async function indexPages() {
  console.log('🚀 Starting pSEO Indexing Engine...');

  // 1. Check for Service Account
  if (!fs.existsSync(SERVICE_ACCOUNT_FILE)) {
    console.error('❌ ERROR: service-account.json not found in root directory.');
    console.log('Please download your Google Cloud Service Account key and save it as "service-account.json".');
    return;
  }

  // 2. Load Subreddits
  const subreddits = JSON.parse(fs.readFileSync(MASTER_SUBREDDITS_FILE, 'utf8'));
  console.log(`📂 Loaded ${subreddits.length} subreddits.`);

  // 3. Load Cache
  let cache = {};
  if (fs.existsSync(INDEXED_CACHE_FILE)) {
    cache = JSON.parse(fs.readFileSync(INDEXED_CACHE_FILE, 'utf8'));
  }

  // 4. Generate Target URLs
  const allUrls = [];
  solutionSlugs.forEach(slug => {
    subreddits.forEach(sub => {
      const subSlug = sub.toLowerCase().replace(/r\//, '').replace(/\//g, '');
      allUrls.push(`${BASE_URL}/solutions/${slug}/${subSlug}`);
    });
  });

  console.log(`🔗 Generated ${allUrls.length} total pSEO URLs.`);

  // 5. Filter unindexed URLs (limit to 200 per run to respect Google quota)
  const toIndex = allUrls.filter(url => !cache[url]).slice(0, 200);

  if (toIndex.length === 0) {
    console.log('✅ All pages are already in the indexing cache. Nothing to do!');
    return;
  }

  console.log(`📡 Preparing to index ${toIndex.length} URLs (Batch Limit)...`);

  // 6. Authenticate
  const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_FILE,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });

  let jwtClient;
  try {
    jwtClient = await auth.getClient();
    console.log('🔐 Authenticated with Google Indexing API.');
  } catch (err) {
    console.error('❌ Authentication failed:', err.message);
    return;
  }

  const indexing = google.indexing({
    version: 'v3',
    auth: jwtClient
  });

  // 7. Execute indexing
  for (const url of toIndex) {
    try {
      await indexing.urlNotifications.publish({
        requestBody: {
          url: url,
          type: 'URL_UPDATED'
        }
      });
      console.log(`✅ Indexed: ${url}`);
      cache[url] = new Date().toISOString();
      
      // Save cache progressively
      fs.writeFileSync(INDEXED_CACHE_FILE, JSON.stringify(cache, null, 2));
      
      // Sleep slightly to avoid burst limits
      await new Promise(r => setTimeout(r, 100));
    } catch (err) {
      console.error(`❌ Failed to index ${url}:`, err.response?.data?.error?.message || err.message);
      if (err.response?.status === 429) {
        console.log('⚠️ Quota exceeded for today. Stopping.');
        break;
      }
    }
  }

  console.log('\n✨ Batch complete. Run this script again tomorrow to process the next batch.');
}

indexPages().catch(console.error);
