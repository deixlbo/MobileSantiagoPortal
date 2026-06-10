-- Allow blotter reports to be filed without explicitly providing a complainant name.
-- This supports residents where the authenticated user identity is already available.

ALTER TABLE public.blotters
  ALTER COLUMN complainant DROP NOT NULL;
