-- Create a table to track limited lifetime slots
CREATE TABLE IF NOT EXISTS public.lifetime_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    total_slots INTEGER NOT NULL DEFAULT 10,
    sold_slots INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.lifetime_slots ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the slot counts
CREATE POLICY "Allow public read access to lifetime_slots"
ON public.lifetime_slots FOR SELECT
TO public
USING (true);

-- Only service role can update (handled by webhooks)
-- No policy needed for update as we use service role in webhooks

-- Seed the initial record
INSERT INTO public.lifetime_slots (total_slots, sold_slots)
VALUES (10, 0)
ON CONFLICT DO NOTHING;
