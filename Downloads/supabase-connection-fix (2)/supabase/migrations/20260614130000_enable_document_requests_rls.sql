ALTER TABLE public.document_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "document_requests_allow_all" ON public.document_requests;

CREATE POLICY "document_requests_allow_all"
  ON public.document_requests
  FOR ALL
  USING (true)
  WITH CHECK (true);
