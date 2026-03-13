-- Create email_logs table
CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    to_email TEXT NOT NULL,
    subject TEXT,
    context JSONB,
    sent_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for email_logs
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    website_url TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for newsletter_subscribers
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Policies for email_logs
CREATE POLICY "Admins can view email logs" 
ON public.email_logs FOR SELECT 
TO authenticated 
USING (is_admin());

-- Policies for newsletter_subscribers
CREATE POLICY "Public can subscribe to newsletter" 
ON public.newsletter_subscribers FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Admins can manage newsletter subscribers" 
ON public.newsletter_subscribers FOR ALL 
TO authenticated 
USING (is_admin());
