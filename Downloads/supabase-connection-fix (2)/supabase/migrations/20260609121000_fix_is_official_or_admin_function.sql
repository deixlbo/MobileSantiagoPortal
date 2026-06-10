-- Fix RLS helper function to use the profiles table for role checking
-- This ensures official/admin access is correctly determined from stored profile roles.

CREATE OR REPLACE FUNCTION is_official_or_admin(user_id UUID)
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
