-- Allow blotter reports to be filed without a known respondent.
-- This supports residents who need to report incidents when the respondent is unknown.

ALTER TABLE public.blotters
  ALTER COLUMN respondent DROP NOT NULL;
