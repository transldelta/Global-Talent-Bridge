-- =============================================================================
-- Application & Employer Workflow Migration
-- Branch: feature/application-employer-workflow
-- Created: 2026-06-03
-- RLS ON, row-owner policies for candidates/employers, admin via service role
-- =============================================================================

-- 1. application_requests, 2. saved_candidates,
-- 3. interview_requests, 4. contact_release_requests
-- (Already applied to Supabase via MCP — this file is the local reference copy)

CREATE TABLE IF NOT EXISTS public.application_requests (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id    uuid NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  job_id          uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  match_id        uuid REFERENCES public.matches(id) ON DELETE SET NULL,
  status          text NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','reviewed','employer_notified','accepted','rejected','withdrawn')),
  cover_note      text,
  admin_note      text,
  reviewed_by     text,
  reviewed_at     timestamptz,
  employer_notified_at timestamptz,
  created_at      timestamptz DEFAULT now() NOT NULL,
  updated_at      timestamptz DEFAULT now() NOT NULL,
  UNIQUE(candidate_id, job_id)
);

ALTER TABLE public.application_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "application_requests_candidate_read" ON public.application_requests
  FOR SELECT TO authenticated
  USING (candidate_id IN (SELECT id FROM public.candidates WHERE user_id = auth.uid()));

CREATE POLICY "application_requests_employer_read" ON public.application_requests
  FOR SELECT TO authenticated
  USING (job_id IN (SELECT id FROM public.jobs WHERE employer_id IN (SELECT id FROM public.employers WHERE user_id = auth.uid())));

CREATE POLICY "application_requests_candidate_insert" ON public.application_requests
  FOR INSERT TO authenticated
  WITH CHECK (candidate_id IN (SELECT id FROM public.candidates WHERE user_id = auth.uid()));

CREATE POLICY "application_requests_candidate_withdraw" ON public.application_requests
  FOR UPDATE TO authenticated
  USING (candidate_id IN (SELECT id FROM public.candidates WHERE user_id = auth.uid()))
  WITH CHECK (status = 'withdrawn');

CREATE INDEX IF NOT EXISTS idx_app_requests_candidate ON public.application_requests (candidate_id);
CREATE INDEX IF NOT EXISTS idx_app_requests_job ON public.application_requests (job_id);
CREATE INDEX IF NOT EXISTS idx_app_requests_status ON public.application_requests (status);

CREATE TABLE IF NOT EXISTS public.saved_candidates (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  employer_id     uuid NOT NULL REFERENCES public.employers(id) ON DELETE CASCADE,
  candidate_id    uuid NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  job_id          uuid REFERENCES public.jobs(id) ON DELETE SET NULL,
  note            text,
  created_at      timestamptz DEFAULT now() NOT NULL,
  UNIQUE(employer_id, candidate_id, job_id)
);

ALTER TABLE public.saved_candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "saved_candidates_employer_read" ON public.saved_candidates
  FOR SELECT TO authenticated
  USING (employer_id IN (SELECT id FROM public.employers WHERE user_id = auth.uid()));

CREATE POLICY "saved_candidates_employer_insert" ON public.saved_candidates
  FOR INSERT TO authenticated
  WITH CHECK (employer_id IN (SELECT id FROM public.employers WHERE user_id = auth.uid()));

CREATE POLICY "saved_candidates_employer_delete" ON public.saved_candidates
  FOR DELETE TO authenticated
  USING (employer_id IN (SELECT id FROM public.employers WHERE user_id = auth.uid()));

CREATE INDEX IF NOT EXISTS idx_saved_candidates_employer ON public.saved_candidates (employer_id);
CREATE INDEX IF NOT EXISTS idx_saved_candidates_candidate ON public.saved_candidates (candidate_id);

CREATE TABLE IF NOT EXISTS public.interview_requests (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  employer_id     uuid NOT NULL REFERENCES public.employers(id) ON DELETE CASCADE,
  candidate_id    uuid NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  job_id          uuid REFERENCES public.jobs(id) ON DELETE SET NULL,
  application_id  uuid REFERENCES public.application_requests(id) ON DELETE SET NULL,
  status          text NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','admin_approved','candidate_notified','confirmed','declined','cancelled')),
  proposed_date   date,
  proposed_time   text,
  format          text DEFAULT 'video' CHECK (format IN ('video','phone','in_person')),
  message         text,
  admin_note      text,
  approved_by     text,
  approved_at     timestamptz,
  created_at      timestamptz DEFAULT now() NOT NULL,
  updated_at      timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.interview_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "interview_requests_employer_read" ON public.interview_requests
  FOR SELECT TO authenticated
  USING (employer_id IN (SELECT id FROM public.employers WHERE user_id = auth.uid()));

CREATE POLICY "interview_requests_candidate_read" ON public.interview_requests
  FOR SELECT TO authenticated
  USING (candidate_id IN (SELECT id FROM public.candidates WHERE user_id = auth.uid()));

CREATE POLICY "interview_requests_employer_insert" ON public.interview_requests
  FOR INSERT TO authenticated
  WITH CHECK (employer_id IN (SELECT id FROM public.employers WHERE user_id = auth.uid()));

CREATE UNIQUE INDEX IF NOT EXISTS idx_interview_requests_unique
  ON public.interview_requests (employer_id, candidate_id, job_id);

CREATE INDEX IF NOT EXISTS idx_interview_requests_employer ON public.interview_requests (employer_id);
CREATE INDEX IF NOT EXISTS idx_interview_requests_candidate ON public.interview_requests (candidate_id);
CREATE INDEX IF NOT EXISTS idx_interview_requests_status ON public.interview_requests (status);

CREATE TABLE IF NOT EXISTS public.contact_release_requests (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  employer_id     uuid NOT NULL REFERENCES public.employers(id) ON DELETE CASCADE,
  candidate_id    uuid NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  job_id          uuid REFERENCES public.jobs(id) ON DELETE SET NULL,
  application_id  uuid REFERENCES public.application_requests(id) ON DELETE SET NULL,
  status          text NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','approved','rejected','revoked')),
  reason          text,
  admin_note      text,
  approved_by     text,
  approved_at     timestamptz,
  released_email  text,
  released_phone  text,
  created_at      timestamptz DEFAULT now() NOT NULL,
  updated_at      timestamptz DEFAULT now() NOT NULL,
  UNIQUE(employer_id, candidate_id, job_id)
);

ALTER TABLE public.contact_release_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contact_release_employer_read" ON public.contact_release_requests
  FOR SELECT TO authenticated
  USING (employer_id IN (SELECT id FROM public.employers WHERE user_id = auth.uid()));

CREATE POLICY "contact_release_employer_insert" ON public.contact_release_requests
  FOR INSERT TO authenticated
  WITH CHECK (employer_id IN (SELECT id FROM public.employers WHERE user_id = auth.uid()));

CREATE INDEX IF NOT EXISTS idx_contact_release_employer ON public.contact_release_requests (employer_id);
CREATE INDEX IF NOT EXISTS idx_contact_release_candidate ON public.contact_release_requests (candidate_id);
CREATE INDEX IF NOT EXISTS idx_contact_release_status ON public.contact_release_requests (status);
