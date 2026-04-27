-- Barangay Santiago Official Portal - Database Schema
-- This script creates all necessary tables for the system

-- 1. USERS TABLE (Core authentication)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  contact_number VARCHAR(20),
  user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('admin', 'official', 'resident')),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive', 'rejected')),
  is_activated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. ADMINS TABLE
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role VARCHAR(100) NOT NULL,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. OFFICIALS TABLE
CREATE TABLE IF NOT EXISTS public.officials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  position VARCHAR(100) NOT NULL,
  department VARCHAR(100),
  image_url VARCHAR(500),
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. RESIDENTS TABLE
CREATE TABLE IF NOT EXISTS public.residents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  purok VARCHAR(100),
  birth_date DATE,
  civil_status VARCHAR(50),
  occupation VARCHAR(100),
  address VARCHAR(255),
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. DOCUMENT TYPES TABLE
CREATE TABLE IF NOT EXISTS public.document_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  requirements JSONB,
  processing_days INTEGER,
  fee DECIMAL(10, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. DOCUMENT REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.document_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id UUID NOT NULL REFERENCES public.residents(id) ON DELETE CASCADE,
  document_type_id UUID NOT NULL REFERENCES public.document_types(id),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'approved', 'rejected', 'ready_for_pickup', 'claimed')),
  priority VARCHAR(50) DEFAULT 'normal' CHECK (priority IN ('normal', 'urgent')),
  required_documents JSONB,
  submitted_documents JSONB DEFAULT '[]',
  notes TEXT,
  approved_by UUID REFERENCES public.officials(id),
  approval_date TIMESTAMP,
  pickup_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. BLOTTER TABLE
CREATE TABLE IF NOT EXISTS public.blotter (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number VARCHAR(50) UNIQUE NOT NULL,
  complainant_id UUID NOT NULL REFERENCES public.residents(id),
  respondent_name VARCHAR(255) NOT NULL,
  respondent_purok VARCHAR(100),
  incident_date TIMESTAMP NOT NULL,
  incident_location VARCHAR(255),
  case_description TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'filed' CHECK (status IN ('filed', 'mediation_scheduled', 'hearing_scheduled', 'resolved', 'dismissed', 'referred')),
  case_type VARCHAR(100),
  assigned_official_id UUID REFERENCES public.officials(id),
  mediation_date TIMESTAMP,
  hearing_date TIMESTAMP,
  resolution_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES public.officials(id),
  image_url VARCHAR(500),
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'ongoing', 'completed')),
  start_date DATE,
  end_date DATE,
  budget DECIMAL(15, 2),
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. ASSETS TABLE
CREATE TABLE IF NOT EXISTS public.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  quantity INTEGER DEFAULT 1,
  condition VARCHAR(50),
  acquisition_date DATE,
  location VARCHAR(255),
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON public.users(user_type);
CREATE INDEX IF NOT EXISTS idx_residents_user_id ON public.residents(user_id);
CREATE INDEX IF NOT EXISTS idx_officials_user_id ON public.officials(user_id);
CREATE INDEX IF NOT EXISTS idx_document_requests_resident_id ON public.document_requests(resident_id);
CREATE INDEX IF NOT EXISTS idx_document_requests_status ON public.document_requests(status);
CREATE INDEX IF NOT EXISTS idx_blotter_complainant_id ON public.blotter(complainant_id);
CREATE INDEX IF NOT EXISTS idx_blotter_case_number ON public.blotter(case_number);
CREATE INDEX IF NOT EXISTS idx_blotter_status ON public.blotter(status);
CREATE INDEX IF NOT EXISTS idx_announcements_author_id ON public.announcements(author_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blotter ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES

-- Users: Only admins can view all users, users can view their own
CREATE POLICY "users_admin_view" ON public.users
  FOR SELECT USING (
    auth.uid()::text IN (SELECT user_id::text FROM public.admins)
  );

CREATE POLICY "users_self_view" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Residents: Users can view their own, officials can view all
CREATE POLICY "residents_self_view" ON public.residents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "residents_official_view" ON public.residents
  FOR SELECT USING (
    auth.uid()::text IN (SELECT user_id::text FROM public.officials)
  );

-- Officials: Everyone can view officials
CREATE POLICY "officials_public_view" ON public.officials
  FOR SELECT USING (TRUE);

-- Document Requests: Users can view their own, officials can view all
CREATE POLICY "document_requests_self_view" ON public.document_requests
  FOR SELECT USING (
    resident_id IN (SELECT id FROM public.residents WHERE user_id = auth.uid())
  );

CREATE POLICY "document_requests_official_view" ON public.document_requests
  FOR SELECT USING (
    auth.uid()::text IN (SELECT user_id::text FROM public.officials)
  );

-- Blotter: Residents can view their own, officials can view all
CREATE POLICY "blotter_self_view" ON public.blotter
  FOR SELECT USING (
    complainant_id IN (SELECT id FROM public.residents WHERE user_id = auth.uid())
  );

CREATE POLICY "blotter_official_view" ON public.blotter
  FOR SELECT USING (
    auth.uid()::text IN (SELECT user_id::text FROM public.officials)
  );

-- Announcements: Everyone can view published
CREATE POLICY "announcements_public_view" ON public.announcements
  FOR SELECT USING (is_published = TRUE);

-- Projects: Everyone can view
CREATE POLICY "projects_public_view" ON public.projects
  FOR SELECT USING (TRUE);

-- Assets: Everyone can view
CREATE POLICY "assets_public_view" ON public.assets
  FOR SELECT USING (TRUE);
