-- ============================================================
-- Sprint I: CV / Lebenslauf Upload Storage
-- Bucket: candidate-cvs (privat, 5MB, PDF/DOC/DOCX)
-- ============================================================

-- Storage-Bucket anlegen (privat)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'candidate-cvs',
  'candidate-cvs',
  false,
  5242880, -- 5 MB in Bytes
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- RLS-Richtlinien für Storage-Objekte
-- Kandidaten können nur eigene Dateien hochladen (Pfad: {user_id}/*)
CREATE POLICY "Kandidat kann eigene CVs hochladen"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'candidate-cvs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Kandidaten können eigene CVs lesen
CREATE POLICY "Kandidat kann eigene CVs lesen"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'candidate-cvs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Kandidaten können eigene CVs löschen/ersetzen
CREATE POLICY "Kandidat kann eigene CVs löschen"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'candidate-cvs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Service-Role hat vollen Zugriff (für Admin-Downloads)
CREATE POLICY "Service Role hat vollen CV-Zugriff"
  ON storage.objects FOR ALL
  TO service_role
  USING (bucket_id = 'candidate-cvs');

-- candidates-Tabelle: cv_url Spalte hinzufügen
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS cv_url TEXT;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS cv_filename TEXT;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS cv_uploaded_at TIMESTAMPTZ;

-- Index für schnelle Suche nach Kandidaten mit CV
CREATE INDEX IF NOT EXISTS idx_candidates_cv_url ON candidates(cv_url) WHERE cv_url IS NOT NULL;
