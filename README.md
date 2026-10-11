# RedLeads

RedLeads is an AI-powered lead generation and monitoring platform built with Next.js, Supabase, and automated background workers.

## Features

- **Automated Ingestion**: Scheduled daily ingestion powered by Tavily and AI models to discover and track leads.
- **Daily Digest**: Automated email digest generation and delivery via Resend.
- **Database Maintenance**: Scheduled cleanup tasks to maintain optimal database performance.
- **Modern Next.js Frontend**: Responsive web interface with real-time updates and analytics.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   AI_API_KEY=...
   TAVILY_API_KEY=...
   RESEND_API_KEY=...
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Scheduled Workflows

Background workers run via GitHub Actions (`.github/workflows/scheduler.yml`):
- **Ingestion**: Daily at 06:00 UTC
- **Daily Digest**: Daily at 08:00 UTC
- **Database Cleanup**: Daily at 00:00 UTC

