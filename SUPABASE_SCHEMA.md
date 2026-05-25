# Supabase Schema (reference only)

This file contains a Postgres-style schema and sample data for tables used by the Barangay Santiago app. It's a reference / makefile only — it does not connect to Supabase.

-- ENUMS / TYPES
-- Use `CREATE TYPE ... AS ENUM (...)` in Postgres

-- Blotter status
CREATE TYPE blotter_status AS ENUM ('pending', 'ongoing', 'resolved', 'closed');

-- Document request status
CREATE TYPE document_status AS ENUM ('pending', 'processing', 'approved', 'rejected');

-- Project status
CREATE TYPE project_status AS ENUM ('planning', 'ongoing', 'completed');

-- Notification type
CREATE TYPE notification_type AS ENUM ('info', 'alert', 'approval', 'rejection');

-- Role enum
CREATE TYPE role_type AS ENUM ('resident', 'staff', 'captain', 'admin');

-- TABLES

-- residents: canonical resident records
CREATE TABLE residents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  phone text,
  purok text,
  address text,
  verified boolean DEFAULT false,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- users: authentication + RBAC (may link to residents)
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid REFERENCES residents(id) ON DELETE SET NULL,
  email text UNIQUE NOT NULL,
  password_hash text, -- if using external auth, this may be null
  role role_type DEFAULT 'resident',
  last_sign_in timestamptz,
  created_at timestamptz DEFAULT now()
);

-- documents: requests for clearances, certificates, etc.
CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid REFERENCES residents(id) ON DELETE CASCADE,
  doc_type text NOT NULL,
  status document_status DEFAULT 'pending',
  payload jsonb DEFAULT '{}'::jsonb, -- generated fields, template data
  or_number text, -- if approved and a receipt exists
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz
);

-- blotters: incident reports submitted by residents
CREATE TABLE blotters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid REFERENCES residents(id) ON DELETE SET NULL,
  respondent text, -- free text; may be person or business
  incident_date date,
  location text,
  description text,
  evidence jsonb DEFAULT '[]'::jsonb, -- array of attachments metadata
  status blotter_status DEFAULT 'pending',
  assigned_to uuid REFERENCES users(id) ON DELETE SET NULL,
  reference_number text UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz
);

-- announcements
CREATE TABLE announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text,
  audience text DEFAULT 'all', -- could be 'residents', 'officials', etc.
  published_at timestamptz,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- notifications
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type notification_type DEFAULT 'info',
  title text,
  body text,
  data jsonb DEFAULT '{}'::jsonb,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- projects
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status project_status DEFAULT 'planning',
  budget numeric DEFAULT 0,
  start_date date,
  end_date date,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- ordinances: uploaded or created ordinance documents
CREATE TABLE ordinances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number text, -- e.g., '001'
  year text,
  title text,
  full_title text,
  status text,
  date date,
  author text,
  whereas text[],
  sections jsonb DEFAULT '[]'::jsonb,
  file_url text, -- optional link to stored PDF/HTML
  created_at timestamptz DEFAULT now()
);

-- attachments: generic file metadata referenced from other tables
CREATE TABLE attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_table text NOT NULL,
  owner_id uuid NOT NULL,
  filename text NOT NULL,
  url text NOT NULL,
  mime text,
  size integer,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- INDEXES / SUGGESTIONS
-- CREATE INDEX idx_residents_purok ON residents(purok);
-- CREATE INDEX idx_documents_resident ON documents(resident_id);
-- CREATE INDEX idx_blotters_status ON blotters(status);

-- SAMPLE DATA (Blotters-like entries)
-- Note: These are example INSERTs you can adapt locally.

INSERT INTO residents (id, first_name, last_name, email, phone, purok, address, verified)
VALUES
  ('11111111-1111-1111-1111-111111111111','Juan','Dela Cruz','juan@example.com','09171234567','Purok 1','Brgy. Santiago, San Antonio',true),
  ('22222222-2222-2222-2222-222222222222','Maria','Santos','maria@example.com','09179876543','Purok 2','Brgy. Santiago, San Antonio',false);

INSERT INTO users (id, resident_id, email, role)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','juan@example.com','resident'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',NULL,'admin@barangay.local','admin');

INSERT INTO blotters (id, reporter_id, respondent, incident_date, location, description, evidence, status, assigned_to, reference_number)
VALUES
  ('33333333-3333-3333-3333-333333333333','11111111-1111-1111-1111-111111111111','Pedro Ramos','2026-05-10','Purok 1 - Main St','Noise disturbance: loud music after 11pm. Neighbors complained.','[{"filename":"evidence1.jpg","url":"/uploads/evidence1.jpg"}]'::jsonb,'pending','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','BLT-2026-0001'),
  ('44444444-4444-4444-4444-444444444444','22222222-2222-2222-2222-222222222222','ACME Store','2026-04-01','Market Area','Illegal dumping observed behind the store.','[]'::jsonb,'ongoing',NULL,'BLT-2026-0002');

-- Example document request
INSERT INTO documents (id, resident_id, doc_type, status, payload)
VALUES
  ('55555555-5555-5555-5555-555555555555','11111111-1111-1111-1111-111111111111','barangay_clearance','approved','{"control_number":"CL-2026-0001","purpose":"Employment","issued_date":"2026-05-12"}'::jsonb);

-- JSON sample for a blotter as returned by an API
-- {
--   "id": "33333333-3333-3333-3333-333333333333",
--   "reporter": { "id": "11111111-1111-1111-1111-111111111111", "name": "Juan Dela Cruz" },
--   "respondent": "Pedro Ramos",
--   "incident_date": "2026-05-10",
--   "location": "Purok 1 - Main St",
--   "description": "Noise disturbance: loud music after 11pm...",
--   "evidence": [{ "filename": "evidence1.jpg", "url": "/uploads/evidence1.jpg" }],
--   "status": "pending",
--   "reference_number": "BLT-2026-0001"
-- }

-- Notes & guidance
- Use `jsonb` fields for flexible metadata (attachments, generated document payloads).
- Create appropriate policies in Supabase for row-level security keyed to `auth.uid()` when you connect this schema to a real DB.
- Adjust UUID defaults (e.g., `gen_random_uuid()` or `uuid_generate_v4()`) based on your Postgres extensions.
