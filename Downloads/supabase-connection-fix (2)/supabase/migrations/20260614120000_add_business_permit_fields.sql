ALTER TABLE document_requests
  ADD COLUMN IF NOT EXISTS business_name TEXT,
  ADD COLUMN IF NOT EXISTS business_address TEXT,
  ADD COLUMN IF NOT EXISTS owner_name TEXT,
  ADD COLUMN IF NOT EXISTS home_address TEXT,
  ADD COLUMN IF NOT EXISTS contact_number TEXT,
  ADD COLUMN IF NOT EXISTS type_of_business TEXT,
  ADD COLUMN IF NOT EXISTS nature_of_business TEXT,
  ADD COLUMN IF NOT EXISTS capitalization_amount NUMERIC,
  ADD COLUMN IF NOT EXISTS tin TEXT;
