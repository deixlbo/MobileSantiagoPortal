-- Fix foreign key relationships to ensure Supabase schema cache recognizes them

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'document_requests' AND relnamespace = 'public'::regnamespace) THEN
    ALTER TABLE document_requests
      DROP CONSTRAINT IF EXISTS document_requests_approved_by_fkey,
      DROP CONSTRAINT IF EXISTS document_requests_created_by_fkey;

    ALTER TABLE document_requests
      ADD CONSTRAINT document_requests_approved_by_profiles_fkey
        FOREIGN KEY (approved_by) REFERENCES public.profiles(id) ON DELETE SET NULL,
      ADD CONSTRAINT document_requests_created_by_profiles_fkey
        FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

    CREATE INDEX IF NOT EXISTS idx_document_requests_approved_by ON document_requests(approved_by);
    CREATE INDEX IF NOT EXISTS idx_document_requests_created_by ON document_requests(created_by);

    COMMENT ON COLUMN document_requests.resident_id IS 'Foreign key to profiles table - resident who made the request';
    COMMENT ON COLUMN document_requests.approved_by IS 'Foreign key to profiles table - official who approved the request';
    COMMENT ON COLUMN document_requests.created_by IS 'Foreign key to profiles table - user who created the request';
  END IF;
END$$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'payments' AND relnamespace = 'public'::regnamespace) THEN
    ALTER TABLE payments
      DROP CONSTRAINT IF EXISTS payments_processed_by_fkey;

    ALTER TABLE payments
      ADD CONSTRAINT payments_processed_by_profiles_fkey
        FOREIGN KEY (processed_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

    CREATE INDEX IF NOT EXISTS idx_payments_processed_by ON payments(processed_by);
  END IF;
END$$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'verification_documents' AND relnamespace = 'public'::regnamespace) THEN
    ALTER TABLE verification_documents
      DROP CONSTRAINT IF EXISTS verification_documents_verified_by_fkey;

    ALTER TABLE verification_documents
      ADD CONSTRAINT verification_documents_verified_by_profiles_fkey
        FOREIGN KEY (verified_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

    CREATE INDEX IF NOT EXISTS idx_verification_documents_verified_by ON verification_documents(verified_by);
  END IF;
END$$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'document_requests' AND relnamespace = 'public'::regnamespace) THEN
    EXECUTE 'VACUUM ANALYZE public.document_requests';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'payments' AND relnamespace = 'public'::regnamespace) THEN
    EXECUTE 'VACUUM ANALYZE public.payments';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'verification_documents' AND relnamespace = 'public'::regnamespace) THEN
    EXECUTE 'VACUUM ANALYZE public.verification_documents';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'profiles' AND relnamespace = 'public'::regnamespace) THEN
    EXECUTE 'VACUUM ANALYZE public.profiles';
  END IF;
END$$;
