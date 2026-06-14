-- Ensure projects table allows authenticated officials to insert/update/delete rows
CREATE OR REPLACE FUNCTION public.is_official_or_admin(u uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS(
    SELECT 1
    FROM public.profiles
    WHERE id = u AND role IN ('official', 'admin')
  );
$$;

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Projects visible to authenticated users" ON public.projects;
DROP POLICY IF EXISTS "Officials can manage projects" ON public.projects;
DROP POLICY IF EXISTS "Officials can insert projects" ON public.projects;

CREATE POLICY "Projects visible to authenticated users"
  ON public.projects
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Officials can manage projects"
  ON public.projects
  FOR ALL
  USING (public.is_official_or_admin(auth.uid()))
  WITH CHECK (public.is_official_or_admin(auth.uid()));

CREATE POLICY "Officials can insert projects"
  ON public.projects
  FOR INSERT
  WITH CHECK (public.is_official_or_admin(auth.uid()));
