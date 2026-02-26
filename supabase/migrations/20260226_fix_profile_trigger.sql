-- Migration: Fix profiles trigger to allow service_role and admin updates
-- This migration fixes the issue where webhooks (service_role) were blocked from updating subscription tiers.

-- 1. Create or replace the security function
CREATE OR REPLACE FUNCTION handle_profile_security()
RETURNS TRIGGER AS $$
BEGIN
    -- Allow the service_role (webhooks, workers) to modify everything
    IF (current_setting('role') = 'service_role') THEN
        RETURN NEW;
    END IF;

    -- Allow users with is_admin = true to modify everything
    -- We use a subquery to check current user's admin status to avoid recursion or if it's in the same table
    -- Alternatively, if is_admin is in the profiles table:
    IF (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)) THEN
        RETURN NEW;
    END IF;

    -- For regular users, block modification of sensitive fields
    IF (
        NEW.subscription_tier IS DISTINCT FROM OLD.subscription_tier OR
        NEW.keyword_limit IS DISTINCT FROM OLD.keyword_limit OR
        NEW.is_admin IS DISTINCT FROM OLD.is_admin
    ) THEN
        -- Allow the update ONLY if the value isn't actually changing (redundant but safe)
        -- Otherwise RAISE EXCEPTION
        RAISE EXCEPTION 'You are not authorized to modify sensitive profile fields.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Identify the existing trigger and drop it
-- Since the exact name might vary, we look for triggers on 'profiles' that call a function with 'security' or 'protect' in name
-- Or we just try to drop known names from previous hardening
DROP TRIGGER IF EXISTS protect_sensitive_profile_fields ON profiles;
DROP TRIGGER IF EXISTS ensure_profile_security ON profiles;

-- 3. Apply the new trigger
CREATE TRIGGER ensure_profile_security
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION handle_profile_security();

-- 4. Grant necessary permissions
GRANT EXECUTE ON FUNCTION handle_profile_security() TO authenticated, service_role;
