-- Migration: Update handle_new_user and set_trial_on_signup triggers
-- Ensures new signups after May 20, 2026 do not get a default 7-day trial on creation, keeping trial_ends_at as NULL.

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id, email, subscription_tier, trial_ends_at)
  values (
    new.id, 
    new.email, 
    'trial', 
    CASE 
      WHEN now() < '2026-05-20 00:00:00Z'::timestamptz THEN timezone('utc'::text, now()) + interval '7 days'
      ELSE NULL
    END
  );
  return new;
end;
$function$;

CREATE OR REPLACE FUNCTION public.set_trial_on_signup()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.trial_ends_at IS NULL AND now() < '2026-05-20 00:00:00Z'::timestamptz THEN
    NEW.trial_ends_at := NOW() + interval '7 days';
  END IF;
  IF NEW.subscription_tier IS NULL THEN
    NEW.subscription_tier := 'trial';
  END IF;
  RETURN NEW;
END;
$function$;
