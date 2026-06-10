-- Create storage buckets for resident uploads and assets
-- This migration sets up the resident-uploads bucket with proper RLS policies

-- Create the resident-uploads bucket
INSERT INTO storage.buckets (id, name, owner, file_size_limit, allowed_mime_types, public)
VALUES (
  'resident-uploads',
  'resident-uploads',
  NULL,
  10485760,  -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  false
)
ON CONFLICT (id) DO NOTHING;

-- Create the assets bucket for public asset images
INSERT INTO storage.buckets (id, name, owner, file_size_limit, allowed_mime_types, public)
VALUES (
  'assets',
  'assets',
  NULL,
  52428800,  -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/jpg'],
  true
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Residents can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Residents can read their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Officials and admins can read all documents" ON storage.objects;
DROP POLICY IF EXISTS "Service role full access" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read uploaded documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete documents" ON storage.objects;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy 1: Service role has full access (for backend operations)
CREATE POLICY "service_role_full_access"
ON storage.objects
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Policy 2: Residents can upload documents to their own folder
CREATE POLICY "residents_can_upload_own_documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'resident-uploads' AND
  (auth.uid()::text = (string_to_array(name, '/'))[2] OR auth.role() = 'service_role')
);

-- Policy 3: Residents can read their own documents
CREATE POLICY "residents_can_read_own_documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'resident-uploads' AND
  (auth.uid()::text = (string_to_array(name, '/'))[2] OR auth.role() = 'service_role')
);

-- Policy 4: Officials and admins can read all documents
CREATE POLICY "officials_admins_read_all_documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'resident-uploads' AND
  (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'official') OR
    auth.role() = 'service_role'
  )
);

-- Policy 5: Residents can delete their own documents
CREATE POLICY "residents_can_delete_own_documents"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'resident-uploads' AND
  (auth.uid()::text = (string_to_array(name, '/'))[2] OR auth.role() = 'service_role')
);

-- Policy 6: Admins can delete any documents
CREATE POLICY "admins_can_delete_any_documents"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'resident-uploads' AND
  ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' OR auth.role() = 'service_role')
);
