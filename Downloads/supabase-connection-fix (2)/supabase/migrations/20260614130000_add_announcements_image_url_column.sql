-- Add image_url to announcements if the column is missing
ALTER TABLE public.announcements
  ADD COLUMN IF NOT EXISTS image_url TEXT;
