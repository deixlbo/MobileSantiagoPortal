-- ============================================================
-- MOBILE SANTIAGO PORTAL - DATABASE SCHEMA
-- ============================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. PROFILES TABLE (Admins & Residents)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'resident')),
  first_name VARCHAR(100),
  middle_name VARCHAR(100),
  last_name VARCHAR(100),
  suffix VARCHAR(50),
  civil_status VARCHAR(50),
  purok VARCHAR(100),
  gender VARCHAR(50),
  occupation VARCHAR(100),
  contact_number VARCHAR(20),
  address TEXT,
  date_of_birth DATE,
  verification_status VARCHAR(50) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'declined')),
  id_type VARCHAR(100),
  id_path VARCHAR(500),
  profile_picture_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT email_unique UNIQUE(email)
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_verification_status ON profiles(verification_status);
CREATE INDEX idx_profiles_created_at ON profiles(created_at);

-- ============================================================
-- 2. DOCUMENT REQUESTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS document_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resident_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  document_type VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'ready_for_pickup', 'completed')),
  control_number VARCHAR(50) UNIQUE,
  purpose TEXT,
  notes TEXT,
  issued_by UUID REFERENCES profiles(id),
  issued_date TIMESTAMP WITH TIME ZONE,
  pickup_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_document_requests_resident_id ON document_requests(resident_id);
CREATE INDEX idx_document_requests_status ON document_requests(status);
CREATE INDEX idx_document_requests_created_at ON document_requests(created_at);
CREATE INDEX idx_document_requests_control_number ON document_requests(control_number);

-- ============================================================
-- 3. NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('info', 'warning', 'success', 'error', 'document', 'announcement')),
  link VARCHAR(500),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- ============================================================
-- 4. AUDIT LOGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(100),
  changes JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================================
-- 5. COMPLAINTS/BLOTTERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS complaints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resident_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'closed')),
  priority VARCHAR(50) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_complaints_resident_id ON complaints(resident_id);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_category ON complaints(category);
CREATE INDEX idx_complaints_created_at ON complaints(created_at);

-- ============================================================
-- 6. ANNOUNCEMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  posted_by UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT FALSE,
  image_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_announcements_status ON announcements(status);
CREATE INDEX idx_announcements_created_at ON announcements(created_at);

-- ============================================================
-- 7. HOUSEHOLDS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS households (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  head_of_household_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  purok VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  total_members INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_households_head_of_household_id ON households(head_of_household_id);
CREATE INDEX idx_households_purok ON households(purok);

-- ============================================================
-- 8. HOUSEHOLD MEMBERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS household_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  resident_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  relationship VARCHAR(100),
  date_of_birth DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_household_members_household_id ON household_members(household_id);
CREATE INDEX idx_household_members_resident_id ON household_members(resident_id);

-- ============================================================
-- 9. FILE UPLOADS METADATA TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS file_uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resident_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100),
  file_size BIGINT,
  blob_url VARCHAR(500),
  upload_type VARCHAR(100) CHECK (upload_type IN ('id_photo', 'proof_of_residency', 'document', 'profile_picture')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_file_uploads_resident_id ON file_uploads(resident_id);
CREATE INDEX idx_file_uploads_created_at ON file_uploads(created_at);

-- ============================================================
-- 10. PAYMENTS TABLE (for future use)
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resident_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  document_request_id UUID REFERENCES document_requests(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method VARCHAR(100),
  reference_number VARCHAR(100),
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payments_resident_id ON payments(resident_id);
CREATE INDEX idx_payments_status ON payments(status);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- PROFILES: Users can only read their own profile, admins can read all
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- DOCUMENT_REQUESTS: Residents can only see their own, admins see all
CREATE POLICY "Residents can view own documents" ON document_requests
  FOR SELECT USING (resident_id = auth.uid());

CREATE POLICY "Admins can view all documents" ON document_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- NOTIFICATIONS: Users can only read their own
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

-- FILE_UPLOADS: Users can only upload their own files
CREATE POLICY "Users can upload own files" ON file_uploads
  FOR INSERT WITH CHECK (resident_id = auth.uid());

CREATE POLICY "Users can view own uploads" ON file_uploads
  FOR SELECT USING (resident_id = auth.uid());

-- PAYMENTS: Users can view their own payments
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (resident_id = auth.uid());

-- ============================================================
-- CREATE UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_requests_updated_at BEFORE UPDATE ON document_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON complaints
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_households_updated_at BEFORE UPDATE ON households
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_file_uploads_updated_at BEFORE UPDATE ON file_uploads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- STORAGE SETUP (Run in Supabase dashboard Storage tab)
-- ============================================================
-- Create bucket for resident uploads (run separately in Supabase UI):
-- CREATE BUCKET "resident-uploads" WITH (
--   public = FALSE
-- );

-- Create bucket for announcements (run separately in Supabase UI):
-- CREATE BUCKET "announcements" WITH (
--   public = FALSE
-- );
