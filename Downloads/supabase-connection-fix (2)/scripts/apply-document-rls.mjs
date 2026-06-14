import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const sql = `
ALTER TABLE public.document_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_uploads ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'document_types' AND policyname = 'service_role_full_access_document_types'
  ) THEN
    CREATE POLICY "service_role_full_access_document_types"
      ON public.document_types FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'document_types' AND policyname = 'authenticated_users_read_document_types'
  ) THEN
    CREATE POLICY "authenticated_users_read_document_types"
      ON public.document_types FOR SELECT TO authenticated USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'document_requests' AND policyname = 'service_role_full_access_document_requests'
  ) THEN
    CREATE POLICY "service_role_full_access_document_requests"
      ON public.document_requests FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'document_requests' AND policyname = 'authenticated_users_manage_own_document_requests'
  ) THEN
    CREATE POLICY "authenticated_users_manage_own_document_requests"
      ON public.document_requests FOR ALL TO authenticated
      USING (
        resident_id IS NOT NULL
        AND resident_id IN (SELECT id FROM public.residents WHERE user_id = auth.uid())
      )
      WITH CHECK (
        resident_id IS NOT NULL
        AND resident_id IN (SELECT id FROM public.residents WHERE user_id = auth.uid())
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'document_requests' AND policyname = 'officials_admins_manage_document_requests'
  ) THEN
    CREATE POLICY "officials_admins_manage_document_requests"
      ON public.document_requests FOR ALL TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'official')
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'official')
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'document_uploads' AND policyname = 'service_role_full_access_document_uploads'
  ) THEN
    CREATE POLICY "service_role_full_access_document_uploads"
      ON public.document_uploads FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'document_uploads' AND policyname = 'authenticated_users_manage_own_document_uploads'
  ) THEN
    CREATE POLICY "authenticated_users_manage_own_document_uploads"
      ON public.document_uploads FOR ALL TO authenticated
      USING (
        resident_id IS NOT NULL
        AND resident_id IN (SELECT id FROM public.residents WHERE user_id = auth.uid())
      )
      WITH CHECK (
        resident_id IS NOT NULL
        AND resident_id IN (SELECT id FROM public.residents WHERE user_id = auth.uid())
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'document_uploads' AND policyname = 'officials_admins_read_document_uploads'
  ) THEN
    CREATE POLICY "officials_admins_read_document_uploads"
      ON public.document_uploads FOR SELECT TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'official')
        )
      );
  END IF;
END $$;
`

const { error } = await supabase.rpc('exec_sql', { sql })
if (error) {
  console.error('Failed to apply RLS policies:', error)
  process.exit(1)
}

console.log('Document table RLS policies applied successfully.')
