-- 202606060090_fix_rls_operator_tables.sql
--
-- Security Fix: operator_actions + pilot_outreach_drafts
--
-- Problem: Beide Tabellen hatten eine Policy mit USING(true) ohne Rollen-Filter,
--          was anonymen und authentifizierten Clients vollen Lese-/Schreibzugriff
--          über die Supabase REST API erlaubte.
--
-- Lösung: Alle Rechte für anon + authenticated entziehen.
--         Beide Tabellen sind ausschließlich über createAdminClient() (service_role)
--         erreichbar — service_role bypassed RLS komplett (BYPASSRLS-Attribut).
--         Keine neue Policy für service_role nötig.
--
-- Idempotent: DROP POLICY IF EXISTS, REVOKE ist idempotent (kein Fehler bei fehlendem Grant).

-- ============================================================
-- operator_actions
-- ============================================================

-- 1. Offene Policy entfernen
DROP POLICY IF EXISTS "Admin full access to operator_actions"
  ON public.operator_actions;

-- 2. Alle Grants für anon + authenticated entziehen
REVOKE ALL ON TABLE public.operator_actions FROM anon;
REVOKE ALL ON TABLE public.operator_actions FROM authenticated;

-- 3. RLS sicherheitshalber erneut aktivieren (idempotent)
ALTER TABLE public.operator_actions ENABLE ROW LEVEL SECURITY;

-- 4. Explizite Deny-Policy als zweite Verteidigungslinie:
--    Selbst wenn jemand künftig versehentlich Grants erteilt,
--    blockiert diese Policy jeden Zugriff für anon + authenticated.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'operator_actions'
      AND policyname = 'deny_all_non_service_role_operator_actions'
  ) THEN
    CREATE POLICY "deny_all_non_service_role_operator_actions"
      ON public.operator_actions
      FOR ALL
      TO anon, authenticated
      USING (false)
      WITH CHECK (false);
  END IF;
END $$;

-- ============================================================
-- pilot_outreach_drafts
-- ============================================================

-- 1. Offene Policy entfernen
DROP POLICY IF EXISTS "Admin full access to pilot_outreach_drafts"
  ON public.pilot_outreach_drafts;

-- 2. Alle Grants für anon + authenticated entziehen
REVOKE ALL ON TABLE public.pilot_outreach_drafts FROM anon;
REVOKE ALL ON TABLE public.pilot_outreach_drafts FROM authenticated;

-- 3. RLS sicherheitshalber erneut aktivieren (idempotent)
ALTER TABLE public.pilot_outreach_drafts ENABLE ROW LEVEL SECURITY;

-- 4. Explizite Deny-Policy als zweite Verteidigungslinie
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'pilot_outreach_drafts'
      AND policyname = 'deny_all_non_service_role_pilot_outreach_drafts'
  ) THEN
    CREATE POLICY "deny_all_non_service_role_pilot_outreach_drafts"
      ON public.pilot_outreach_drafts
      FOR ALL
      TO anon, authenticated
      USING (false)
      WITH CHECK (false);
  END IF;
END $$;
