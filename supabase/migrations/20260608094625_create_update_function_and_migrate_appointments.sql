-- Create the update function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger
DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
DROP INDEX IF EXISTS idx_appointments_date;

-- Drop old columns and add new ones
ALTER TABLE appointments 
  DROP COLUMN IF EXISTS scheduled_time,
  DROP COLUMN IF EXISTS scheduled_date,
  ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS duration_minutes INTEGER;

-- Recreate index
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(scheduled_at);

-- Recreate trigger
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();;
