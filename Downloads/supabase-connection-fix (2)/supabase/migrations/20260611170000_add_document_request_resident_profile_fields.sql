ALTER TABLE document_requests
  ADD COLUMN IF NOT EXISTS requester_name TEXT,
  ADD COLUMN IF NOT EXISTS requester_first_name TEXT,
  ADD COLUMN IF NOT EXISTS requester_middle_name TEXT,
  ADD COLUMN IF NOT EXISTS requester_last_name TEXT,
  ADD COLUMN IF NOT EXISTS requester_suffix TEXT,
  ADD COLUMN IF NOT EXISTS requester_purok TEXT,
  ADD COLUMN IF NOT EXISTS requester_civil_status TEXT,
  ADD COLUMN IF NOT EXISTS requester_email TEXT;
