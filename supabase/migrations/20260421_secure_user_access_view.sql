-- Secure the user_access_status view by setting security_invoker = true
-- This ensures the view executes with the permissions of the current user rather than the view owner (postgres).
-- Without this, the view bypasses RLS on the underlying `profiles` and `dev_admins` tables.

ALTER VIEW user_access_status SET (security_invoker = true);
