-- Fix announcements RLS policy to allow proper insert operations
-- Issue: RLS policy was too restrictive for insert operations

-- Drop existing policies that might be conflicting
DROP POLICY IF EXISTS "Published announcements visible to all" ON announcements;
DROP POLICY IF EXISTS "Officials can manage announcements" ON announcements;
DROP POLICY IF EXISTS "Officials can insert announcements" ON announcements;

-- Ensure RLS is enabled
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow anyone to read published announcements
CREATE POLICY "Published announcements visible to all" ON announcements
  FOR SELECT USING (
    status = 'published' 
    OR is_official_or_admin(auth.uid())
  );

-- Policy 2: Allow service role (backend API) to perform all operations
-- This is the key fix - service_role key should bypass RLS but being explicit helps
CREATE POLICY "service_role_full_access" ON announcements
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Policy 3: Allow officials/admins to manage all announcements
CREATE POLICY "officials_manage_announcements" ON announcements
  FOR ALL USING (
    is_official_or_admin(auth.uid())
  )
  WITH CHECK (
    is_official_or_admin(auth.uid())
  );

-- Policy 4: Allow officials/admins to insert announcements with explicit WITH CHECK
CREATE POLICY "officials_insert_announcements" ON announcements
  FOR INSERT WITH CHECK (
    is_official_or_admin(auth.uid()) OR auth.role() = 'service_role'
  );
