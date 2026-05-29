-- =====================================================
-- BARANGAY SANTIAGO MOBILE PORTAL - SUPABASE SCHEMA
-- =====================================================
-- This file contains the SQL schema for all tables used
-- in the Barangay Santiago Mobile Portal application.
-- Run this in your Supabase SQL Editor to create all tables.
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: profiles
-- Stores user profile information for all user types
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'official', 'resident')),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  purok TEXT,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  address TEXT,
  date_of_birth DATE,
  contact_number TEXT,
  occupation TEXT,
  position TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'declined')),
  id_path TEXT,
  household_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_verification_status ON profiles(verification_status);

-- =====================================================
-- TABLE: households
-- Stores household information
-- =====================================================
CREATE TABLE IF NOT EXISTS households (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  purok TEXT,
  head_id UUID REFERENCES profiles(id),
  member_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLE: document_requests
-- Stores document request information
-- =====================================================
CREATE TABLE IF NOT EXISTS document_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resident_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN (
    'barangay_clearance',
    'certificate_of_residency',
    'certificate_of_indigency',
    'certificate_of_solo_parent',
    'barangay_business_clearance',
    'certificate_of_business_closure',
    'certificate_to_file_action',
    'medical_assistance_certificate',
    'blotter_report',
    'settlement_agreement'
  )),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined', 'ready_to_print', 'released')),
  control_number TEXT UNIQUE,
  purpose TEXT,
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES profiles(id),
  rejection_reason TEXT,
  document_path TEXT,
  downloaded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_document_requests_resident ON document_requests(resident_id);
CREATE INDEX IF NOT EXISTS idx_document_requests_status ON document_requests(status);

-- =====================================================
-- TABLE: blotters
-- Stores blotter/incident report information
-- =====================================================
CREATE TABLE IF NOT EXISTS blotters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resident_id UUID REFERENCES profiles(id),
  case_number TEXT UNIQUE,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  location_coords JSONB,
  complainant TEXT NOT NULL,
  complainant_address TEXT,
  respondent TEXT NOT NULL,
  respondent_address TEXT,
  status TEXT DEFAULT 'pending-review' CHECK (status IN (
    'pending-review',
    'under-investigation',
    'scheduled-mediation',
    'ongoing-hearing',
    'resolved',
    'dismissed',
    'escalated'
  )),
  filed_date DATE DEFAULT CURRENT_DATE,
  investigation_date DATE,
  mediation_scheduled_date DATE,
  hearing_date DATE,
  action_taken TEXT,
  resolution TEXT,
  resolution_date DATE,
  resolution_document TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_blotters_status ON blotters(status);
CREATE INDEX IF NOT EXISTS idx_blotters_resident ON blotters(resident_id);

-- =====================================================
-- TABLE: announcements
-- Stores barangay announcements
-- =====================================================
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('urgent', 'important', 'normal')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  category TEXT,
  target_audience TEXT DEFAULT 'all' CHECK (target_audience IN ('all', 'residents', 'officials')),
  publish_date DATE,
  expiry_date DATE,
  author TEXT,
  views INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_announcements_status ON announcements(status);
CREATE INDEX IF NOT EXISTS idx_announcements_priority ON announcements(priority);

-- =====================================================
-- TABLE: projects
-- Stores community/barangay projects
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  location TEXT,
  start_date DATE,
  target_completion DATE,
  status TEXT DEFAULT 'Planned' CHECK (status IN ('Planned', 'Ongoing', 'Completed', 'On Hold', 'Cancelled')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  budget DECIMAL(15, 2),
  spent DECIMAL(15, 2) DEFAULT 0,
  source TEXT,
  project_head TEXT,
  project_head_position TEXT,
  beneficiaries TEXT,
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- =====================================================
-- TABLE: ordinances
-- Stores barangay ordinances and resolutions
-- =====================================================
CREATE TABLE IF NOT EXISTS ordinances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT,
  category TEXT,
  file_path TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by UUID REFERENCES profiles(id)
);

-- =====================================================
-- TABLE: notifications
-- Stores user notifications
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'general' CHECK (type IN ('approval', 'decline', 'announcement', 'blotter_update', 'general')),
  link TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- =====================================================
-- TABLE: activity_logs
-- Stores admin/system activity logs
-- =====================================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at);

-- =====================================================
-- TABLE: appointments
-- Stores scheduled appointments
-- =====================================================
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resident_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  purpose TEXT,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_appointments_resident ON appointments(resident_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(scheduled_date);

-- =====================================================
-- TABLE: assets
-- Stores barangay assets inventory
-- =====================================================
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  quantity INTEGER DEFAULT 1,
  condition TEXT DEFAULT 'Good' CHECK (condition IN ('Excellent', 'Good', 'Fair', 'Poor', 'For Disposal')),
  location TEXT,
  acquisition_date DATE,
  acquisition_cost DECIMAL(15, 2),
  current_value DECIMAL(15, 2),
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'In Use', 'Under Maintenance', 'Disposed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE blotters ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordinances ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view their own profile, admins/officials can view all
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'official'))
  );

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Document requests: Residents see their own, officials/admins see all
CREATE POLICY "Residents view own requests" ON document_requests
  FOR SELECT USING (auth.uid() = resident_id);

CREATE POLICY "Officials view all requests" ON document_requests
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'official'))
  );

CREATE POLICY "Residents can create requests" ON document_requests
  FOR INSERT WITH CHECK (auth.uid() = resident_id);

CREATE POLICY "Officials can update requests" ON document_requests
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'official'))
  );

-- Announcements: Published ones visible to all, drafts to officials/admins only
CREATE POLICY "Published announcements visible to all" ON announcements
  FOR SELECT USING (status = 'published' OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'official'))
  );

CREATE POLICY "Officials can manage announcements" ON announcements
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'official'))
  );

-- Notifications: Users see only their own
CREATE POLICY "Users view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Projects: Visible to all
CREATE POLICY "Projects visible to authenticated users" ON projects
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Officials can manage projects" ON projects
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'official'))
  );

-- Blotters: Own blotters for residents, all for officials
CREATE POLICY "Residents view own blotters" ON blotters
  FOR SELECT USING (auth.uid() = resident_id);

CREATE POLICY "Officials view all blotters" ON blotters
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'official'))
  );

CREATE POLICY "Residents can create blotters" ON blotters
  FOR INSERT WITH CHECK (auth.uid() = resident_id OR auth.uid() IS NOT NULL);

CREATE POLICY "Officials can manage blotters" ON blotters
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'official'))
  );

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_households_updated_at BEFORE UPDATE ON households
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_requests_updated_at BEFORE UPDATE ON document_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blotters_updated_at BEFORE UPDATE ON blotters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SAMPLE DATA (OPTIONAL - REMOVE IN PRODUCTION)
-- =====================================================
-- Uncomment the following to insert sample data for testing

/*
-- Sample announcement
INSERT INTO announcements (title, content, priority, status, category, author, publish_date)
VALUES (
  'Welcome to Barangay Santiago Portal',
  'We are excited to launch our new online portal for residents. You can now request documents, file blotters, and stay updated with community announcements.',
  'important',
  'published',
  'Governance',
  'Barangay Administrator',
  CURRENT_DATE
);

-- Sample project
INSERT INTO projects (title, type, description, location, status, progress, budget, source, project_head)
VALUES (
  'Road Improvement Program',
  'Infrastructure',
  'Repair and improvement of main roads in Purok 1-3',
  'Purok 1-3, Barangay Santiago',
  'Ongoing',
  45,
  150000,
  'Barangay Development Fund',
  'Juan Dela Cruz'
);
*/
