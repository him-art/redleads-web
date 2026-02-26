-- Migration: Add post_created_at to monitored_leads
-- Description: Stores the actual creation date of the Reddit post found via Power Search.

ALTER TABLE monitored_leads
ADD COLUMN IF NOT EXISTS post_created_at TIMESTAMP WITH TIME ZONE;

-- Add a comment for documentation
COMMENT ON COLUMN monitored_leads.post_created_at IS 'The original creation timestamp of the lead (if available from source)';
