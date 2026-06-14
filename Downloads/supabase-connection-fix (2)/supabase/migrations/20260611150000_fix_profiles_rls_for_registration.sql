-- Fix profiles RLS so registration and backend APIs can insert profiles without violating policies
DO $$
BEGIN
  -- Remove the problematic INSERT policy for public users if it exists
  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND policyname = 'Users can insert their own profile for registration'
  ) THEN
    DROP POLICY "Users can insert their own profile for registration" ON public.profiles;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND policyname = 'Residents can insert own profile on registration'
  ) THEN
    DROP POLICY "Residents can insert own profile on registration" ON public.profiles;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND policyname = 'Users can insert own profile on registration'
  ) THEN
    DROP POLICY "Users can insert own profile on registration" ON public.profiles;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND policyname = 'Users can insert their own profile'
  ) THEN
    DROP POLICY "Users can insert their own profile" ON public.profiles;
  END IF;

  -- Ensure the backend service role can manage profiles explicitly
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND policyname = 'service_role_full_access_profiles'
  ) THEN
    CREATE POLICY "service_role_full_access_profiles"
      ON public.profiles
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;

  -- Keep self-service read/update access for authenticated users
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile"
      ON public.profiles
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON public.profiles
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;
