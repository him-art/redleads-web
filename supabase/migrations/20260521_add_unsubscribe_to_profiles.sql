-- Add unsubscribed column to public.profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS unsubscribed BOOLEAN DEFAULT false;

-- Ensure any existing records have it set to false
UPDATE public.profiles SET unsubscribed = false WHERE unsubscribed IS NULL;
