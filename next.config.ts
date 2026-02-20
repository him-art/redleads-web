import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { 
            key: 'Access-Control-Allow-Origin', 
            value: process.env.NODE_ENV === 'production' 
              ? (process.env.NEXT_PUBLIC_SITE_URL || 'https://RedLeads.app') 
              : '*' 
          },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://*.posthog.com https://*.firebaseapp.com https://*.googleapis.com https://*.gstatic.com https://www.clarity.ms https://scripts.clarity.ms https://www.googletagmanager.com https://www.google-analytics.com https://js.dodopayments.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data: https://*.googleusercontent.com https://*.reddit.com https://*.clarity.ms https://c.clarity.ms https://www.googletagmanager.com https://www.google-analytics.com; font-src 'self' data: https://r2cdn.perplexity.ai https://fonts.gstatic.com; connect-src 'self' wss://*.supabase.co https://*.supabase.co https://*.googleapis.com https://*.firebaseio.com https://api.groq.com https://api.tavily.com https://www.reddit.com/search.json https://*.posthog.com https://*.clarity.ms https://*.google-analytics.com https://*.analytics.google.com https://api.dodopayments.com;",
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/auth/v1/:path*',
        destination: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/:path*`,
      },
      {
        source: '/rest/v1/:path*',
        destination: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/:path*`,
      },
      {
        source: '/storage/v1/:path*',
        destination: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/join',
        destination: '/login',
        permanent: true,
      },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};



export default nextConfig;
