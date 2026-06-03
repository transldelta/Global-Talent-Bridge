-- Migration: application_requests — Nachrichtenmodus-Spalten
-- Angewendet: 2026-06-04 via Supabase MCP (direkt auf Remote-Projekt)
-- Zweck: Test-Modus-Tracking für automatisch generierte Bewerbungsnachrichten

ALTER TABLE public.application_requests
  ADD COLUMN IF NOT EXISTS auto_generated_message boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS message_generation_mode text NOT NULL DEFAULT 'manual'
    CHECK (message_generation_mode IN ('manual', 'test_auto'));

COMMENT ON COLUMN public.application_requests.auto_generated_message IS
  'true wenn die Nachricht serverseitig generiert wurde (ENABLE_TEST_AUTO_APPLICATION_MESSAGE=true)';

COMMENT ON COLUMN public.application_requests.message_generation_mode IS
  'manual = Kandidat hat selbst geschrieben; test_auto = Template-Generator (Testmodus)';
