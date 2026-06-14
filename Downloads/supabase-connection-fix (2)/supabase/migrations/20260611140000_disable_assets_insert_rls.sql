-- Disable the assets INSERT policy while preserving public read access
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'assets'
      AND policyname = 'Officials can insert assets'
  ) THEN
    DROP POLICY "Officials can insert assets" ON public.assets;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'assets'
      AND policyname = 'Public read assets'
  ) THEN
    CREATE POLICY "Public read assets"
      ON public.assets
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;
