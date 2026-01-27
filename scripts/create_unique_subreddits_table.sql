-- Migration: Create unique_subreddits table for global deduplication
-- This table tracks all subreddits being monitored across all users
-- Required by rss-hybrid-monitor.ts

CREATE TABLE IF NOT EXISTS unique_subreddits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    last_pubdate TIMESTAMPTZ,
    error_streak INTEGER NOT NULL DEFAULT 0,
    paused_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookups by name
CREATE INDEX IF NOT EXISTS idx_unique_subreddits_name ON unique_subreddits(name);

-- Index for finding non-paused subreddits
CREATE INDEX IF NOT EXISTS idx_unique_subreddits_paused ON unique_subreddits(paused_until);

-- RLS (service role only - managed by worker)
ALTER TABLE unique_subreddits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role to manage unique_subreddits"
    ON unique_subreddits
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Function to sync unique_subreddits from profiles
-- Call this after creating the table to populate it
CREATE OR REPLACE FUNCTION sync_unique_subreddits()
RETURNS void AS $$
BEGIN
    INSERT INTO unique_subreddits (name)
    SELECT DISTINCT LOWER(TRIM(sub))
    FROM profiles, LATERAL unnest(subreddits) AS sub
    WHERE subreddits IS NOT NULL AND array_length(subreddits, 1) > 0
    ON CONFLICT (name) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Run the sync function to populate initial data
SELECT sync_unique_subreddits();
