-- =============================================================================
-- Growth Engine Migration
-- Branch: feature/growth-engine-controlled-automation
-- Created: 2026-06-03
-- DSGVO-compliant, RLS enabled, all writes require service role
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. employer_leads
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.employer_leads (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name    text NOT NULL,
  contact_name    text,
  contact_email   text,
  contact_phone   text,
  city            text,
  country         text DEFAULT 'Deutschland',
  sector          text,
  company_size    text,            -- 'small' | 'medium' | 'large'
  source          text NOT NULL DEFAULT 'manual',  -- 'manual' | 'referral' | 'agent_suggested' | 'imported'
  status          text NOT NULL DEFAULT 'new',     -- 'new' | 'contacted' | 'interested' | 'qualified' | 'closed_won' | 'closed_lost'
  priority        text NOT NULL DEFAULT 'medium',  -- 'low' | 'medium' | 'high' | 'critical'
  score           integer DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  notes           text,
  last_contacted_at timestamptz,
  next_followup_at  timestamptz,
  created_at      timestamptz DEFAULT now() NOT NULL,
  updated_at      timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.employer_leads ENABLE ROW LEVEL SECURITY;

-- No permissive policy for anon/authenticated — service role only
CREATE POLICY "employer_leads_deny_all" ON public.employer_leads
  FOR ALL TO anon, authenticated USING (false);

CREATE INDEX IF NOT EXISTS idx_employer_leads_status ON public.employer_leads (status);
CREATE INDEX IF NOT EXISTS idx_employer_leads_priority ON public.employer_leads (priority);
CREATE INDEX IF NOT EXISTS idx_employer_leads_sector ON public.employer_leads (sector);

-- ---------------------------------------------------------------------------
-- 2. candidate_growth_sources
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.candidate_growth_sources (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  source_name     text NOT NULL,
  source_type     text NOT NULL,   -- 'job_board' | 'social_media' | 'partner' | 'referral' | 'organic' | 'event'
  url             text,
  country         text DEFAULT 'International',
  target_sector   text,
  estimated_candidates integer DEFAULT 0,
  status          text NOT NULL DEFAULT 'identified',  -- 'identified' | 'outreach_sent' | 'active' | 'inactive'
  contact_name    text,
  contact_email   text,
  notes           text,
  monthly_cost_eur numeric(10,2) DEFAULT 0,
  created_at      timestamptz DEFAULT now() NOT NULL,
  updated_at      timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.candidate_growth_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "candidate_growth_sources_deny_all" ON public.candidate_growth_sources
  FOR ALL TO anon, authenticated USING (false);

CREATE INDEX IF NOT EXISTS idx_cgs_source_type ON public.candidate_growth_sources (source_type);
CREATE INDEX IF NOT EXISTS idx_cgs_status ON public.candidate_growth_sources (status);

-- ---------------------------------------------------------------------------
-- 3. partner_leads
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.partner_leads (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_name text NOT NULL,
  partner_type    text NOT NULL,   -- 'language_school' | 'recruitment_agency' | 'job_portal' | 'university' | 'ngo' | 'government'
  contact_name    text,
  contact_email   text,
  contact_phone   text,
  city            text,
  country         text DEFAULT 'Deutschland',
  potential_candidates_per_month integer DEFAULT 0,
  partnership_model text,          -- 'referral_fee' | 'revenue_share' | 'free' | 'barter'
  status          text NOT NULL DEFAULT 'identified',  -- 'identified' | 'contacted' | 'negotiating' | 'active' | 'inactive'
  notes           text,
  created_at      timestamptz DEFAULT now() NOT NULL,
  updated_at      timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.partner_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "partner_leads_deny_all" ON public.partner_leads
  FOR ALL TO anon, authenticated USING (false);

CREATE INDEX IF NOT EXISTS idx_partner_leads_partner_type ON public.partner_leads (partner_type);
CREATE INDEX IF NOT EXISTS idx_partner_leads_status ON public.partner_leads (status);

-- ---------------------------------------------------------------------------
-- 4. outreach_campaigns
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.outreach_campaigns (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name            text NOT NULL,
  description     text,
  target_segment  text NOT NULL,   -- 'employers' | 'candidates' | 'partners'
  template_key    text,
  status          text NOT NULL DEFAULT 'draft',   -- 'draft' | 'approved' | 'active' | 'paused' | 'completed'
  approved_by     text,
  approved_at     timestamptz,
  start_date      date,
  end_date        date,
  target_count    integer DEFAULT 0,
  sent_count      integer DEFAULT 0,
  response_count  integer DEFAULT 0,
  conversion_count integer DEFAULT 0,
  created_at      timestamptz DEFAULT now() NOT NULL,
  updated_at      timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.outreach_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "outreach_campaigns_deny_all" ON public.outreach_campaigns
  FOR ALL TO anon, authenticated USING (false);

CREATE INDEX IF NOT EXISTS idx_outreach_campaigns_status ON public.outreach_campaigns (status);
CREATE INDEX IF NOT EXISTS idx_outreach_campaigns_target ON public.outreach_campaigns (target_segment);

-- ---------------------------------------------------------------------------
-- 5. outreach_messages
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.outreach_messages (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id     uuid REFERENCES public.outreach_campaigns(id) ON DELETE SET NULL,
  recipient_type  text NOT NULL,   -- 'employer_lead' | 'partner_lead' | 'candidate_source'
  recipient_id    uuid,
  recipient_name  text,
  recipient_email text,
  subject         text,
  body            text NOT NULL,
  channel         text NOT NULL DEFAULT 'email',  -- 'email' | 'linkedin' | 'whatsapp' | 'phone'
  status          text NOT NULL DEFAULT 'draft',   -- 'draft' | 'approved' | 'sent' | 'bounced' | 'replied'
  approved_by     text,
  approved_at     timestamptz,
  sent_at         timestamptz,
  replied_at      timestamptz,
  notes           text,
  created_at      timestamptz DEFAULT now() NOT NULL,
  updated_at      timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.outreach_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "outreach_messages_deny_all" ON public.outreach_messages
  FOR ALL TO anon, authenticated USING (false);

CREATE INDEX IF NOT EXISTS idx_outreach_messages_status ON public.outreach_messages (status);
CREATE INDEX IF NOT EXISTS idx_outreach_messages_campaign ON public.outreach_messages (campaign_id);
CREATE INDEX IF NOT EXISTS idx_outreach_messages_recipient_type ON public.outreach_messages (recipient_type);

-- ---------------------------------------------------------------------------
-- 6. growth_tasks
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.growth_tasks (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title           text NOT NULL,
  description     text,
  category        text NOT NULL,   -- 'employer_outreach' | 'candidate_acquisition' | 'partner_development' | 'content' | 'admin'
  priority        text NOT NULL DEFAULT 'medium',  -- 'low' | 'medium' | 'high' | 'critical'
  status          text NOT NULL DEFAULT 'open',    -- 'open' | 'in_progress' | 'done' | 'cancelled'
  assigned_to     text DEFAULT 'CEO',
  due_date        date,
  completed_at    timestamptz,
  source          text DEFAULT 'manual',           -- 'manual' | 'agent_suggested'
  agent_suggestion_id uuid,                        -- reference to agent_suggestions if auto-generated
  created_at      timestamptz DEFAULT now() NOT NULL,
  updated_at      timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.growth_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "growth_tasks_deny_all" ON public.growth_tasks
  FOR ALL TO anon, authenticated USING (false);

CREATE INDEX IF NOT EXISTS idx_growth_tasks_status ON public.growth_tasks (status);
CREATE INDEX IF NOT EXISTS idx_growth_tasks_priority ON public.growth_tasks (priority);
CREATE INDEX IF NOT EXISTS idx_growth_tasks_category ON public.growth_tasks (category);

-- ---------------------------------------------------------------------------
-- 7. growth_agent_runs
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.growth_agent_runs (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  triggered_by    text NOT NULL DEFAULT 'admin',
  leads_scored    integer DEFAULT 0,
  tasks_created   integer DEFAULT 0,
  messages_drafted integer DEFAULT 0,
  signals_found   integer DEFAULT 0,
  duration_ms     integer,
  status          text NOT NULL DEFAULT 'completed',  -- 'running' | 'completed' | 'failed'
  error_message   text,
  summary         text,
  created_at      timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.growth_agent_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "growth_agent_runs_deny_all" ON public.growth_agent_runs
  FOR ALL TO anon, authenticated USING (false);

CREATE INDEX IF NOT EXISTS idx_growth_agent_runs_created ON public.growth_agent_runs (created_at DESC);

-- =============================================================================
-- SEED DATA (only if tables are empty)
-- =============================================================================

-- Seed: employer_leads (5 records)
INSERT INTO public.employer_leads (
  company_name, contact_name, contact_email, city, sector, company_size, source, status, priority, score, notes
)
SELECT * FROM (VALUES
  ('Pflegezentrum Sonnenhof GmbH', 'Frau Schneider', 'kontakt@sonnenhof-pflege.de', 'München', 'Pflege & Gesundheit', 'medium', 'manual', 'new', 'high', 72, 'Betreiber von 3 Pflegeheimen in Bayern. Suchen dringend Pflegefachkräfte aus dem Ausland.'),
  ('LogisTrans GmbH', 'Herr Müller', 'personal@logistrans.de', 'Hamburg', 'Logistik & Transport', 'large', 'referral', 'contacted', 'medium', 58, 'LKW-Fahrer und Lagermitarbeiter gesucht. Referral von Kontakt aus Pilotkit.'),
  ('GastroPro Hamburg AG', 'Maria Weber', 'm.weber@gastropro.de', 'Hamburg', 'Gastronomie & Hotel', 'medium', 'manual', 'interested', 'high', 81, 'Restaurantkette mit 8 Standorten. Haben Interesse bekundet, 10 Köche einzustellen.'),
  ('BauTech Rhein GmbH', 'Thomas König', 'koenig@bautech-rhein.de', 'Köln', 'Handwerk & Bau', 'small', 'manual', 'new', 'medium', 45, 'Kleines Bauunternehmen. Suchen Maurer und Fliesenleger. Budget unklar.'),
  ('IT Solutions Berlin GmbH', 'Dr. Anna Fischer', 'a.fischer@its-berlin.de', 'Berlin', 'IT & Software', 'medium', 'agent_suggested', 'new', 'low', 33, 'Software-Dienstleister. Interesse an internationalen Entwicklern fraglich — zunächst nur Recherche.')
) AS v(company_name, contact_name, contact_email, city, sector, company_size, source, status, priority, score, notes)
WHERE NOT EXISTS (SELECT 1 FROM public.employer_leads LIMIT 1);

-- Seed: candidate_growth_sources (5 records)
INSERT INTO public.candidate_growth_sources (
  source_name, source_type, url, country, target_sector, estimated_candidates, status, notes, monthly_cost_eur
)
SELECT * FROM (VALUES
  ('LinkedIn International Jobs', 'social_media', 'https://linkedin.com/jobs', 'International', 'IT & Software', 500, 'identified', 'Kostenloser Organic-Kanal. Jobs posten und Kandidaten organisch gewinnen.', 0.00),
  ('Jobsin.de – Internationale Stellenbörse', 'job_board', 'https://jobsin.de', 'Deutschland', 'Pflege & Gesundheit', 200, 'outreach_sent', 'Deutsch-internationale Jobplattform. Kostenpflichtig ab Paket. Kontakt aufgenommen.', 99.00),
  ('Ukrainische Community Berlin e.V.', 'partner', NULL, 'Ukraine/Deutschland', 'Handwerk & Bau', 80, 'identified', 'Gemeinnützige Organisation. Unterstützen ukrainische Fachkräfte bei Arbeitsuche. Kooperation möglich.', 0.00),
  ('Make it in Germany (BMAS)', 'job_board', 'https://www.make-it-in-germany.com', 'International', 'Alle Branchen', 1000, 'identified', 'Offizielles Bundesportal. Kostenlose Profilerstellung möglich. Hohe Reichweite.', 0.00),
  ('Pflegejobs.de', 'job_board', 'https://pflegejobs.de', 'Deutschland', 'Pflege & Gesundheit', 300, 'active', 'Bereits aktiv. Monatliche Abrechnung. Gute Qualität der Kandidatenprofile.', 149.00)
) AS v(source_name, source_type, url, country, target_sector, estimated_candidates, status, notes, monthly_cost_eur)
WHERE NOT EXISTS (SELECT 1 FROM public.candidate_growth_sources LIMIT 1);

-- Seed: partner_leads (5 records)
INSERT INTO public.partner_leads (
  organization_name, partner_type, contact_name, contact_email, city, country, potential_candidates_per_month, partnership_model, status, notes
)
SELECT * FROM (VALUES
  ('Deutsch-Institut Frankfurt', 'language_school', 'Frau Becker', 'info@deutsch-institut-ffm.de', 'Frankfurt', 'Deutschland', 15, 'referral_fee', 'identified', 'Große Sprachschule. Viele internationale Schüler suchen Arbeit nach Kurs. Provision pro vermittelter Person denkbar.'),
  ('Global Recruit Agency', 'recruitment_agency', 'Peter Smith', 'p.smith@globalrecruit.eu', 'Wien', 'Österreich', 30, 'revenue_share', 'contacted', 'EU-weit tätige Recruitingagentur. Spezialisiert auf Osteuropa. Umsatzteilung möglich.'),
  ('Universität für Angewandte Wissenschaften Mannheim', 'university', 'Prof. Dr. Krause', 'international@hs-mannheim.de', 'Mannheim', 'Deutschland', 20, 'free', 'identified', 'Hochschule mit Internationalabteilung. Absolventen ohne Job nach Studium. Freie Kooperation möglich.'),
  ('Caritas Migrationsberatung', 'ngo', 'Claudia Huber', 'migration@caritas-muc.de', 'München', 'Deutschland', 10, 'barter', 'negotiating', 'NGO mit Zugang zu vielen Migranten in Deutschland. Kooperation gegen Sichtbarkeit/Empfehlung diskutiert.'),
  ('Bundesagentur für Arbeit – Zentrale Auslands- und Fachvermittlung (ZAV)', 'government', NULL, 'zav@arbeitsagentur.de', 'Bonn', 'Deutschland', 50, 'free', 'identified', 'Offizielle staatliche Stelle für internationale Fachkräftevermittlung. Kostenlose Kooperation. Formeller Prozess.')
) AS v(organization_name, partner_type, contact_name, contact_email, city, country, potential_candidates_per_month, partnership_model, status, notes)
WHERE NOT EXISTS (SELECT 1 FROM public.partner_leads LIMIT 1);

-- Seed: one draft outreach_campaign
INSERT INTO public.outreach_campaigns (
  name, description, target_segment, template_key, status, target_count
)
SELECT
  'Pflegebranche Q3 2026',
  'Systematische Ansprache von Pflegeeinrichtungen in Bayern und NRW für Q3 2026.',
  'employers',
  'EMAIL_FORMAL_PFLEGE',
  'draft',
  50
WHERE NOT EXISTS (SELECT 1 FROM public.outreach_campaigns LIMIT 1);

-- Seed: initial growth_tasks (5 records)
INSERT INTO public.growth_tasks (
  title, description, category, priority, status, assigned_to, due_date
)
SELECT * FROM (VALUES
  ('10 Pflegearbeitgeber in Bayern kontaktieren', 'Liste mit Pflegezentren erstellen und personalisierte E-Mails vorbereiten. Vorlage aus Pilot-Kit verwenden.', 'employer_outreach', 'high', 'open', 'CEO', CURRENT_DATE + INTERVAL '7 days'),
  ('LinkedIn-Post: Internationale Fachkräfte für Deutschland', 'Organischen Content für LinkedIn erstellen. Fokus: Pflegebranche. 3 Posts vorbereiten.', 'content', 'medium', 'open', 'CEO', CURRENT_DATE + INTERVAL '14 days'),
  ('Kooperation mit Deutsch-Institut Frankfurt finalisieren', 'Vertragsentwurf prüfen. Referral-Fee-Modell vorschlagen. Termin für Video-Call vereinbaren.', 'partner_development', 'high', 'open', 'CEO', CURRENT_DATE + INTERVAL '10 days'),
  ('Make-it-in-Germany Profil vervollständigen', 'Plattformprofil auf make-it-in-germany.com anlegen. Alle Stellen eintragen.', 'candidate_acquisition', 'medium', 'open', 'CEO', CURRENT_DATE + INTERVAL '5 days'),
  ('Wöchentlichen Growth-Report einrichten', 'CEO-Dashboard wöchentlich prüfen. KPIs notieren. Fortschritt im Growth-Agent-Protokoll festhalten.', 'admin', 'low', 'open', 'CEO', CURRENT_DATE + INTERVAL '3 days')
) AS v(title, description, category, priority, status, assigned_to, due_date)
WHERE NOT EXISTS (SELECT 1 FROM public.growth_tasks LIMIT 1);
