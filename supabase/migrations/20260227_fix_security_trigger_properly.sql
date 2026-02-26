-- Migration: Fix profiles trigger to remove non-existent is_admin field and allow UPSERT
-- This migration corrects the 500 error while maintaining security for payment webhooks.

CREATE OR REPLACE FUNCTION handle_profile_security()
RETURNS TRIGGER AS $$
BEGIN
    -- 1. Allow service_role (webhooks, workers, adminClient) to modify everything
    -- This is CRITICAL for automated payment updates to work.
    IF (current_setting('role') = 'service_role') THEN
        RETURN NEW;
    END IF;

    -- 2. For regular users, only enforce restrictions on UPDATE
    -- This allows the initial INSERT/UPSERT during onboarding to succeed.
    IF (TG_OP = 'UPDATE') THEN
        -- Safely check if user is an admin without crashing if column doesn't exist
        -- We check our own metadata or we could check a specific permission table
        -- For now, if you are using the 'authenticated' role, we block sensitive changes
        -- unless you are a service_role.
        
        -- Only block if the sensitive fields are actually CHANGING to a new value
        IF (
            (NEW.subscription_tier IS DISTINCT FROM OLD.subscription_tier) OR
            (NEW.keyword_limit IS DISTINCT FROM OLD.keyword_limit)
        ) THEN
            RAISE EXCEPTION 'You are not authorized to modify sensitive profile fields.';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
