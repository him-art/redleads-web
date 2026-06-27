-- Migration: Update signup logic to set onboarding_incomplete as default subscription tier post-cutoff

-- 1. Update public.handle_new_user()
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
    CASE 
      WHEN now() < '2026-05-20 00:00:00Z'::timestamptz THEN 'trial'
      ELSE 'onboarding_incomplete'
    END, 
    CASE 
      WHEN now() < '2026-05-20 00:00:00Z'::timestamptz THEN timezone('utc'::text, now()) + interval '7 days'
      ELSE NULL
    END
  );
  return new;
end;
$function$;

-- 2. Update public.set_trial_on_signup()
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
    NEW.subscription_tier := CASE 
      WHEN now() < '2026-05-20 00:00:00Z'::timestamptz THEN 'trial'
      ELSE 'onboarding_incomplete'
    END;
  END IF;
  RETURN NEW;
END;
$function$;

-- 3. Backfill existing profiles: set 'trial' tier profiles with NULL 'trial_ends_at' to 'onboarding_incomplete'
-- We temporarily disable the trigger ensuring regular users cannot edit fields since migrations run under a role that may not be service_role
ALTER TABLE public.profiles DISABLE TRIGGER ensure_profile_security;

UPDATE public.profiles
SET subscription_tier = 'onboarding_incomplete'
WHERE subscription_tier = 'trial' AND trial_ends_at IS NULL;

ALTER TABLE public.profiles ENABLE TRIGGER ensure_profile_security;
