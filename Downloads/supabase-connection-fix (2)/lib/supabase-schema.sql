-- Supabase Database Schema for Barangay Santiago Portal
-- This script creates all necessary tables with proper RLS policies

-- 1. USERS TABLE (Extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('resident', 'official', 'admin')) DEFAULT 'resident',
  phone_number TEXT,
  profile_image_url TEXT,
  address TEXT,
  purok VARCHAR(50),
  bio TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. RESIDENTS TABLE
CREATE TABLE IF NOT EXISTS public.residents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  household_number TEXT,
  age_group TEXT CHECK (age_group IN ('18-25', '26-35', '36-45', '46-55', '56-65', '65+')) DEFAULT '26-35',
  civil_status TEXT CHECK (civil_status IN ('single', 'married', 'widowed', 'separated')) DEFAULT 'single',
  occupation TEXT,
  years_of_residency INTEGER DEFAULT 1,
  is_bona_fide BOOLEAN DEFAULT false,
  barangay_id_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. OFFICIALS TABLE
CREATE TABLE IF NOT EXISTS public.officials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  position TEXT NOT NULL,
  department TEXT,
  office_hours_start TIME DEFAULT '08:00',
  office_hours_end TIME DEFAULT '17:00',
  working_days TEXT DEFAULT 'Monday-Friday',
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id UUID REFERENCES public.residents(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'issued', 'archived')) DEFAULT 'pending',
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  qr_code_url TEXT,
  issued_by UUID REFERENCES public.users(id),
  issued_date TIMESTAMP WITH TIME ZONE,
  expiry_date TIMESTAMP WITH TIME ZONE,
  is_digital_signed BOOLEAN DEFAULT false,
  signature_url TEXT,
  request_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completion_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. COMPLAINTS TABLE
CREATE TABLE IF NOT EXISTS public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id UUID REFERENCES public.residents(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT CHECK (status IN ('open', 'in_progress', 'resolved', 'closed', 'pending_review')) DEFAULT 'open',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  assigned_to UUID REFERENCES public.users(id),
  location TEXT,
  evidence_url TEXT,
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- 6. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id UUID REFERENCES public.residents(id) ON DELETE CASCADE,
  official_id UUID REFERENCES public.officials(id),
  title TEXT NOT NULL,
  description TEXT,
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show', 'rescheduled')) DEFAULT 'scheduled',
  location TEXT,
  service_type TEXT,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern TEXT,
  notes TEXT,
  reminder_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author_id UUID REFERENCES public.users(id),
  status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  scheduled_publish_date TIMESTAMP WITH TIME ZONE,
  target_audience TEXT CHECK (target_audience IN ('all', 'residents', 'officials', 'admins')) DEFAULT 'all',
  image_url TEXT,
  priority INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT NOT NULL,
  related_entity_id UUID,
  related_entity_type TEXT,
  status TEXT CHECK (status IN ('unread', 'read', 'archived')) DEFAULT 'unread',
  channels TEXT DEFAULT 'in_app',
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id UUID REFERENCES public.residents(id) ON DELETE CASCADE,
  document_id UUID REFERENCES public.documents(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'PHP',
  payment_method TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  transaction_id TEXT UNIQUE,
  stripe_payment_id TEXT,
  reference_number TEXT UNIQUE,
  invoice_number TEXT UNIQUE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type TEXT DEFAULT 'string',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. AUDIT_LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  changes JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  category TEXT NOT NULL,
  status TEXT CHECK (status IN ('new', 'reviewed', 'responded', 'closed')) DEFAULT 'new',
  response TEXT,
  responded_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. MESSAGES TABLE (Internal Messaging)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  subject TEXT,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  attachment_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. USER_ACTIVITY TABLE
CREATE TABLE IF NOT EXISTS public.user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  description TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. ANALYTICS TABLE
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value INTEGER DEFAULT 0,
  metric_date DATE DEFAULT CURRENT_DATE,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. DOCUMENT_UPLOADS TABLE (For multi-file uploads per document request)
CREATE TABLE IF NOT EXISTS public.document_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
  resident_id UUID REFERENCES public.residents(id) ON DELETE CASCADE NOT NULL,
  requirement_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  storage_path TEXT NOT NULL,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_by UUID REFERENCES public.users(id),
  verification_date TIMESTAMP WITH TIME ZONE,
  verification_notes TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_residents_user_id ON public.residents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_resident_id ON public.documents(resident_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON public.documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_document_type ON public.documents(document_type);
CREATE INDEX IF NOT EXISTS idx_complaints_resident_id ON public.complaints(resident_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON public.complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_priority ON public.complaints(priority);
CREATE INDEX IF NOT EXISTS idx_appointments_resident_id ON public.appointments(resident_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON public.notifications(status);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON public.messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_payments_resident_id ON public.payments(resident_id);
CREATE INDEX IF NOT EXISTS idx_document_uploads_document_id ON public.document_uploads(document_id);
CREATE INDEX IF NOT EXISTS idx_document_uploads_resident_id ON public.document_uploads(resident_id);
CREATE INDEX IF NOT EXISTS idx_document_uploads_upload_date ON public.document_uploads(upload_date);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES

-- USERS TABLE POLICIES
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- RESIDENTS TABLE POLICIES
CREATE POLICY "Residents can view their own data" ON public.residents
  FOR SELECT USING (user_id = auth.uid() OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Residents can update their own data" ON public.residents
  FOR UPDATE USING (user_id = auth.uid() OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- DOCUMENTS TABLE POLICIES
CREATE POLICY "Residents can view their own documents" ON public.documents
  FOR SELECT USING (
    resident_id IN (SELECT id FROM public.residents WHERE user_id = auth.uid()) 
    OR (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'official')
  );

CREATE POLICY "Officials and admins can update documents" ON public.documents
  FOR UPDATE USING ((SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'official'));

-- NOTIFICATIONS TABLE POLICIES
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

-- MESSAGES TABLE POLICIES
CREATE POLICY "Users can view messages they sent or received" ON public.messages
  FOR SELECT USING (sender_id = auth.uid() OR recipient_id = auth.uid());

-- Insert initial settings
INSERT INTO public.settings (setting_key, setting_value, setting_type, description)
VALUES
  ('barangay_name', 'Barangay Santiago', 'string', 'Name of the barangay'),
  ('municipality', 'San Antonio', 'string', 'Municipality name'),
  ('province', 'Zambales', 'string', 'Province name'),
  ('email_notifications_enabled', 'true', 'boolean', 'Enable email notifications'),
  ('sms_notifications_enabled', 'false', 'boolean', 'Enable SMS notifications'),
  ('business_hours_start', '08:00', 'string', 'Business hours start time'),
  ('business_hours_end', '17:00', 'string', 'Business hours end time'),
  ('weekend_closed', 'true', 'boolean', 'Office closed on weekends'),
  ('appointment_slot_duration', '30', 'number', 'Appointment slot duration in minutes'),
  ('max_appointments_per_day', '20', 'number', 'Maximum appointments per day')
ON CONFLICT (setting_key) DO NOTHING;
