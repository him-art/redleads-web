-- Migration: Create daily_reports table for storing generated intelligence reports
-- Run this manually in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS daily_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL UNIQUE,
    report_html TEXT NOT NULL,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add index on date for quick lookups
CREATE INDEX IF NOT EXISTS idx_daily_reports_date ON daily_reports(date DESC);

-- Add RLS policies (reports are globally visible to authenticated users)
ALTER TABLE daily_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read daily reports"
    ON daily_reports
    FOR SELECT
    TO authenticated
    USING (true);

-- Only service role can insert/update (from the worker)
CREATE POLICY "Allow service role to manage daily reports"
    ON daily_reports
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
