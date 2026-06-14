-- Ensure announcements can be inserted/updated/deleted by authenticated officials
-- This migration is defensive and can be applied repeatedly.

CREATE OR REPLACE FUNCTION public.is_official_or_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id
      AND role IN ('official', 'admin')
  );
$$;

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published announcements visible to all" ON public.announcements;
DROP POLICY IF EXISTS "service_role_full_access" ON public.announcements;
DROP POLICY IF EXISTS "officials_manage_announcements" ON public.announcements;
DROP POLICY IF EXISTS "officials_insert_announcements" ON public.announcements;

CREATE POLICY "announcements_select_published_or_officials"
ON public.announcements
FOR SELECT
USING (
  status = 'published'
  OR auth.role() = 'service_role'
  OR public.is_official_or_admin(auth.uid())
);

CREATE POLICY "announcements_service_role_full_access"
ON public.announcements
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "announcements_officials_manage"
ON public.announcements
FOR ALL
USING (public.is_official_or_admin(auth.uid()))
WITH CHECK (public.is_official_or_admin(auth.uid()));

CREATE POLICY "announcements_authenticated_insert"
ON public.announcements
FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated'
  AND public.is_official_or_admin(auth.uid())
);
