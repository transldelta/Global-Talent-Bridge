-- 202606060101_fix_revoke_execute_from_public.sql
--
-- Fix: REVOKE EXECUTE FROM PUBLIC for SECURITY DEFINER trigger functions
--
-- Background: PostgreSQL grants EXECUTE to PUBLIC by default.
-- REVOKE from specific roles (anon, authenticated) is overridden by
-- the PUBLIC grant. Must REVOKE FROM PUBLIC to close the gap.
-- Then explicitly GRANT to service_role (for admin operations).
--
-- Verified result after this migration:
--   anon:          can_execute = false  ✅
--   authenticated: can_execute = false  ✅
--   service_role:  can_execute = true   ✅
--
-- Trigger behaviour is UNAFFECTED: PostgreSQL triggers are invoked
-- internally by the engine and do not check EXECUTE privileges.

-- handle_new_user
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- handle_outreach_targets_updated_at
REVOKE EXECUTE ON FUNCTION public.handle_outreach_targets_updated_at() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.handle_outreach_targets_updated_at() TO service_role;

-- set_agent_suggestions_updated_at
REVOKE EXECUTE ON FUNCTION public.set_agent_suggestions_updated_at() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.set_agent_suggestions_updated_at() TO service_role;
