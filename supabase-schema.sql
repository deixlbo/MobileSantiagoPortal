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
-- TABLE: payments
-- Stores payment records for documents and services
-- =====================================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resident_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  document_request_id UUID REFERENCES document_requests(id) ON DELETE SET NULL,
  amount DECIMAL(15, 2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'check', 'online', 'mobile_wallet')),
  reference_number TEXT UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_date TIMESTAMPTZ,
  notes TEXT,
  processed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_resident ON payments(resident_id);
CREATE INDEX IF NOT EXISTS idx_payments_document ON payments(document_request_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- =====================================================
-- TABLE: qr_codes
-- Stores generated QR codes for document verification
-- =====================================================
CREATE TABLE IF NOT EXISTS qr_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_request_id UUID NOT NULL REFERENCES document_requests(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  qr_data JSONB,
  expiry_date TIMESTAMPTZ,
  scan_count INTEGER DEFAULT 0,
  last_scanned TIMESTAMPTZ,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_qr_codes_document ON qr_codes(document_request_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_code ON qr_codes(code);
CREATE INDEX IF NOT EXISTS idx_qr_codes_status ON qr_codes(status);

-- =====================================================
-- TABLE: verification_documents
-- Stores resident ID documents and verification proofs
-- =====================================================
CREATE TABLE IF NOT EXISTS verification_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resident_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('national_id', 'passport', 'drivers_license', 'voters_id', 'tin_id', 'other')),
  id_number TEXT,
  document_path TEXT,
  file_url TEXT,
  ocr_data JSONB,
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES profiles(id),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verification_documents_resident ON verification_documents(resident_id);
CREATE INDEX IF NOT EXISTS idx_verification_documents_verified ON verification_documents(verified);

-- =====================================================
-- TABLE: ocr_results
-- Stores OCR processing results for documents
-- =====================================================
CREATE TABLE IF NOT EXISTS ocr_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES verification_documents(id) ON DELETE CASCADE,
  extracted_data JSONB,
  confidence_score DECIMAL(3, 2),
  processing_status TEXT CHECK (processing_status IN ('pending', 'completed', 'failed')),
  error_message TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ocr_results_document ON ocr_results(document_id);

-- =====================================================
-- TABLE: household_members
-- Stores individual household member information
-- =====================================================
CREATE TABLE IF NOT EXISTS household_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  member_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  relationship TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  occupation TEXT,
  contact_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_household_members_household ON household_members(household_id);
CREATE INDEX IF NOT EXISTS idx_household_members_member ON household_members(member_id);

-- =====================================================
-- TABLE: document_uploads
-- Stores uploaded documents and files
-- =====================================================
CREATE TABLE IF NOT EXISTS document_uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_request_id UUID NOT NULL REFERENCES document_requests(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  upload_status TEXT DEFAULT 'pending' CHECK (upload_status IN ('pending', 'uploaded', 'processing', 'completed', 'failed')),
  uploaded_at TIMESTAMPTZ,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_document_uploads_request ON document_uploads(document_request_id);

-- =====================================================
-- TABLE: resident_biometric
-- Stores resident biometric data (fingerprints, etc.)
-- =====================================================
CREATE TABLE IF NOT EXISTS resident_biometric (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resident_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  fingerprint_data BYTEA,
  face_recognition_data JSONB,
  biometric_type TEXT CHECK (biometric_type IN ('fingerprint', 'facial_recognition', 'iris_scan')),
  enrolled_date TIMESTAMPTZ,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_resident_biometric_resident ON resident_biometric(resident_id);

-- =====================================================
-- TABLE: emergency_alerts
-- Stores emergency alerts and disaster management info
-- =====================================================
CREATE TABLE IF NOT EXISTS emergency_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('fire', 'flood', 'earthquake', 'accident', 'severe_weather', 'public_health', 'other')),
  severity_level TEXT CHECK (severity_level IN ('critical', 'high', 'medium', 'low')),
  location TEXT,
  location_coords JSONB,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'cancelled')),
  affected_residents INTEGER,
  instructions TEXT,
  broadcast_date TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_emergency_alerts_status ON emergency_alerts(status);
CREATE INDEX IF NOT EXISTS idx_emergency_alerts_type ON emergency_alerts(alert_type);

-- =====================================================
-- TABLE: push_subscriptions
-- Stores push notification subscriptions
-- =====================================================
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  endpoint TEXT UNIQUE NOT NULL,
  auth_key TEXT,
  p256dh_key TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user ON push_subscriptions(user_id);

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
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ocr_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE household_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE resident_biometric ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if the schema is rerun
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Residents view own requests" ON document_requests;
DROP POLICY IF EXISTS "Officials view all requests" ON document_requests;
DROP POLICY IF EXISTS "Residents can create requests" ON document_requests;
DROP POLICY IF EXISTS "Officials can update requests" ON document_requests;
DROP POLICY IF EXISTS "Published announcements visible to all" ON announcements;
DROP POLICY IF EXISTS "Officials can manage announcements" ON announcements;
DROP POLICY IF EXISTS "Ordinances visible to authenticated users" ON ordinances;
DROP POLICY IF EXISTS "Officials can manage ordinances" ON ordinances;
DROP POLICY IF EXISTS "Admins can view all households" ON households;
DROP POLICY IF EXISTS "Admins can manage households" ON households;
DROP POLICY IF EXISTS "Users view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Projects visible to authenticated users" ON projects;
DROP POLICY IF EXISTS "Officials can manage projects" ON projects;
DROP POLICY IF EXISTS "Residents view own blotters" ON blotters;
DROP POLICY IF EXISTS "Officials view all blotters" ON blotters;
DROP POLICY IF EXISTS "Residents can create blotters" ON blotters;
DROP POLICY IF EXISTS "Officials can manage blotters" ON blotters;
DROP POLICY IF EXISTS "Residents view own payments" ON payments;
DROP POLICY IF EXISTS "Officials view all payments" ON payments;
DROP POLICY IF EXISTS "Residents can create payments" ON payments;
DROP POLICY IF EXISTS "Admins can view activity logs" ON activity_logs;
DROP POLICY IF EXISTS "Admins can manage activity logs" ON activity_logs;
DROP POLICY IF EXISTS "QR codes visible to authorized users" ON qr_codes;
DROP POLICY IF EXISTS "Residents view own verification" ON verification_documents;
DROP POLICY IF EXISTS "Officials view all verification" ON verification_documents;
DROP POLICY IF EXISTS "Residents can upload verification" ON verification_documents;
DROP POLICY IF EXISTS "Users view own household members" ON household_members;
DROP POLICY IF EXISTS "Users view own document uploads" ON document_uploads;
DROP POLICY IF EXISTS "Residents can upload documents" ON document_uploads;
DROP POLICY IF EXISTS "Users manage own biometric" ON resident_biometric;
DROP POLICY IF EXISTS "Emergency alerts visible to all" ON emergency_alerts;
DROP POLICY IF EXISTS "Officials can manage alerts" ON emergency_alerts;
DROP POLICY IF EXISTS "Users manage own subscriptions" ON push_subscriptions;

-- Profiles: Users can view their own profile, admins/officials can view all
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'official')
  );

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow admins to insert profiles for others (so admin can create resident accounts)
CREATE POLICY "Admins can insert profiles" ON profiles
  FOR INSERT WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles" ON profiles
  FOR ALL USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Document requests: Residents see their own, officials/admins see all
CREATE POLICY "Residents view own requests" ON document_requests
  FOR SELECT USING (
    auth.uid() = resident_id AND
    is_verified(auth.uid())
  );

CREATE POLICY "Officials view all requests" ON document_requests
  FOR SELECT USING (
    is_official_or_admin(auth.uid())
  );

CREATE POLICY "Residents can create requests" ON document_requests
  FOR INSERT WITH CHECK (
    auth.uid() = resident_id AND
    is_verified(auth.uid())
  );

CREATE POLICY "Officials can update requests" ON document_requests
  FOR UPDATE USING (
    is_official_or_admin(auth.uid())
  );

-- Announcements: Published ones visible to all, drafts to officials/admins only
CREATE POLICY "Published announcements visible to all" ON announcements
  FOR SELECT USING (status = 'published' OR 
    is_official_or_admin(auth.uid())
  );

CREATE POLICY "Officials can manage announcements" ON announcements
  FOR ALL USING (
    is_official_or_admin(auth.uid())
  );

-- Allow officials/admins to insert announcements (INSERT requires WITH CHECK)
CREATE POLICY "Officials can insert announcements" ON announcements
  FOR INSERT WITH CHECK (
    is_official_or_admin(auth.uid())
  );

-- Ordinances: All authenticated users can read, officials/admins can manage
CREATE POLICY "Ordinances visible to authenticated users" ON ordinances
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Officials can manage ordinances" ON ordinances
  FOR ALL USING (
    is_official_or_admin(auth.uid())
  );

-- Allow officials/admins to insert ordinances (INSERT requires WITH CHECK)
CREATE POLICY "Officials can insert ordinances" ON ordinances
  FOR INSERT WITH CHECK (
    is_official_or_admin(auth.uid())
  );

-- Households: Admins and officials can manage households
CREATE POLICY "Admins can view all households" ON households
  FOR SELECT USING (
    is_official_or_admin(auth.uid())
  );

CREATE POLICY "Admins can manage households" ON households
  FOR ALL USING (
    is_official_or_admin(auth.uid())
  );

-- Allow admins/officials to insert households
CREATE POLICY "Admins can insert households" ON households
  FOR INSERT WITH CHECK (
    is_official_or_admin(auth.uid())
  );

-- Notifications: Users see only their own
CREATE POLICY "Users view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to create their own notifications
CREATE POLICY "Users can create notifications" ON notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Projects: Visible to all
CREATE POLICY "Projects visible to authenticated users" ON projects
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Officials can manage projects" ON projects
  FOR ALL USING (
    is_official_or_admin(auth.uid())
  );

-- Allow officials/admins to insert projects
CREATE POLICY "Officials can insert projects" ON projects
  FOR INSERT WITH CHECK (
    is_official_or_admin(auth.uid())
  );

-- Blotters: Own blotters for residents, all for officials
CREATE POLICY "Residents view own blotters" ON blotters
  FOR SELECT USING (
    auth.uid() = resident_id AND
    is_verified(auth.uid())
  );

CREATE POLICY "Officials view all blotters" ON blotters
  FOR SELECT USING (
    is_official_or_admin(auth.uid())
  );

CREATE POLICY "Residents can create blotters" ON blotters
  FOR INSERT WITH CHECK (
    auth.uid() = resident_id AND
    is_verified(auth.uid())
  );

CREATE POLICY "Officials can manage blotters" ON blotters
  FOR ALL USING (
    is_official_or_admin(auth.uid())
  );

-- Payments: Residents see own, officials/admins see all
CREATE POLICY "Residents view own payments" ON payments
  FOR SELECT USING (
    auth.uid() = resident_id AND
    is_verified(auth.uid())
  );

CREATE POLICY "Officials view all payments" ON payments
  FOR SELECT USING (
    is_official_or_admin(auth.uid())
  );

CREATE POLICY "Residents can create payments" ON payments
  FOR INSERT WITH CHECK (
    auth.uid() = resident_id AND
    is_verified(auth.uid())
  );

-- Appointments: allow verified residents to view/create their appointments
CREATE POLICY "Residents view own appointments" ON appointments
  FOR SELECT USING (
    auth.uid() = resident_id AND
    is_verified(auth.uid())
  );

CREATE POLICY "Residents can create appointments" ON appointments
  FOR INSERT WITH CHECK (
    auth.uid() = resident_id AND
    is_verified(auth.uid())
  );

CREATE POLICY "Officials can manage appointments" ON appointments
  FOR ALL USING (
    is_official_or_admin(auth.uid())
  );

-- Activity logs: Only admins can view and manage logs
CREATE POLICY "Admins can view activity logs" ON activity_logs
  FOR SELECT USING (
    is_admin(auth.uid())
  );

CREATE POLICY "Admins can manage activity logs" ON activity_logs
  FOR ALL USING (
    is_admin(auth.uid())
  );

-- Allow admins to insert activity logs
CREATE POLICY "Admins can insert activity logs" ON activity_logs
  FOR INSERT WITH CHECK (
    is_admin(auth.uid())
  );

-- QR Codes: Visible to related residents and officials
CREATE POLICY "QR codes visible to authorized users" ON qr_codes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM document_requests dr 
      WHERE dr.id = document_request_id AND (dr.resident_id = auth.uid() OR 
      is_official_or_admin(auth.uid())))
  );

-- Allow officials/admins to insert QR codes (e.g., generate codes)
CREATE POLICY "Officials can insert qr_codes" ON qr_codes
  FOR INSERT WITH CHECK (
    is_official_or_admin(auth.uid())
  );

-- Verification documents: Own documents for residents, all for officials
CREATE POLICY "Residents view own verification" ON verification_documents
  FOR SELECT USING (auth.uid() = resident_id);

CREATE POLICY "Officials view all verification" ON verification_documents
  FOR SELECT USING (
    is_official_or_admin(auth.uid())
  );

CREATE POLICY "Residents can upload verification" ON verification_documents
  FOR INSERT WITH CHECK (auth.uid() = resident_id);

-- Household members: Residents see their household, officials see all
CREATE POLICY "Users view own household members" ON household_members
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM households h 
      WHERE h.id = household_id AND (h.head_id = auth.uid() OR
      is_official_or_admin(auth.uid())))
  );

-- Document uploads: Own uploads for residents, all for officials
CREATE POLICY "Users view own document uploads" ON document_uploads
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM document_requests dr 
      WHERE dr.id = document_request_id AND (dr.resident_id = auth.uid() OR
      is_official_or_admin(auth.uid())))
  );

CREATE POLICY "Residents can upload documents" ON document_uploads
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM document_requests dr 
      WHERE dr.id = document_request_id AND dr.resident_id = auth.uid())
  );

-- Biometric: Own biometric data only
CREATE POLICY "Users manage own biometric" ON resident_biometric
  FOR ALL USING (auth.uid() = resident_id);

-- Emergency alerts: Visible to all authenticated users
CREATE POLICY "Emergency alerts visible to all" ON emergency_alerts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Officials can manage alerts" ON emergency_alerts
  FOR ALL USING (
    is_official_or_admin(auth.uid())
  );

-- Push subscriptions: Users manage own
CREATE POLICY "Users manage own subscriptions" ON push_subscriptions
  FOR ALL USING (auth.uid() = user_id);

-- Allow users to insert their own push subscriptions
CREATE POLICY "Users can insert subscriptions" ON push_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Helper functions to check profile attributes without causing RLS recursion.
-- These functions run with the owner's privileges (SECURITY DEFINER) so policies
-- can call them safely without selecting from `profiles` inside a policy.
CREATE OR REPLACE FUNCTION public.is_admin(u uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = u AND role = 'admin');
$$;

CREATE OR REPLACE FUNCTION public.is_official(u uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = u AND role = 'official');
$$;

CREATE OR REPLACE FUNCTION public.is_official_or_admin(u uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = u AND role IN ('admin', 'official'));
$$;

CREATE OR REPLACE FUNCTION public.is_verified(u uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = u AND verification_status = 'verified');
$$;

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

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_qr_codes_updated_at BEFORE UPDATE ON qr_codes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_verification_documents_updated_at BEFORE UPDATE ON verification_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_household_members_updated_at BEFORE UPDATE ON household_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resident_biometric_updated_at BEFORE UPDATE ON resident_biometric
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emergency_alerts_updated_at BEFORE UPDATE ON emergency_alerts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_push_subscriptions_updated_at BEFORE UPDATE ON push_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- If an admin creates a profile, mark it verified automatically
DROP FUNCTION IF EXISTS public.set_profile_verified_if_admin();
CREATE FUNCTION public.set_profile_verified_if_admin()
RETURNS TRIGGER AS $$
BEGIN
  IF is_admin(auth.uid()) THEN
    NEW.verification_status := 'verified';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profile_verified_if_admin ON public.profiles;
CREATE TRIGGER set_profile_verified_if_admin
BEFORE INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_profile_verified_if_admin();

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
