-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  contact_number VARCHAR(20),
  user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('admin', 'resident', 'official')),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive', 'rejected')),
  is_activated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create residents table
CREATE TABLE IF NOT EXISTS residents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  purok VARCHAR(255),
  address VARCHAR(500),
  birth_date DATE,
  gender VARCHAR(20),
  civil_status VARCHAR(50),
  occupation VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create officials table
CREATE TABLE IF NOT EXISTS officials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  position VARCHAR(255) NOT NULL,
  department VARCHAR(255),
  office_phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100),
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP,
  expires_at TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  document_type VARCHAR(100),
  file_url VARCHAR(500),
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_public BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Create blotter table (incident reports)
CREATE TABLE IF NOT EXISTS blotter (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_date TIMESTAMP NOT NULL,
  incident_type VARCHAR(255) NOT NULL,
  location VARCHAR(500),
  description TEXT,
  reported_by UUID NOT NULL,
  status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'under_investigation', 'resolved', 'closed')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (reported_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Create ordinances table
CREATE TABLE IF NOT EXISTS ordinances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  ordinance_number VARCHAR(50) UNIQUE,
  effective_date DATE,
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  budget DECIMAL(12, 2),
  status VARCHAR(50) DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'completed', 'cancelled')),
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Create assets table
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(500) NOT NULL,
  asset_type VARCHAR(100),
  description TEXT,
  location VARCHAR(500),
  acquisition_date DATE,
  value DECIMAL(12, 2),
  status VARCHAR(50) DEFAULT 'active',
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Create businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name VARCHAR(500) NOT NULL,
  owner_id UUID NOT NULL,
  business_type VARCHAR(255),
  location VARCHAR(500),
  permit_number VARCHAR(100),
  permit_expiry DATE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_residents_user_id ON residents(user_id);
CREATE INDEX idx_officials_user_id ON officials(user_id);
CREATE INDEX idx_announcements_created_by ON announcements(created_by);
CREATE INDEX idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX idx_blotter_reported_by ON blotter(reported_by);
CREATE INDEX idx_ordinances_created_by ON ordinances(created_by);
CREATE INDEX idx_projects_created_by ON projects(created_by);
CREATE INDEX idx_assets_created_by ON assets(created_by);
CREATE INDEX idx_businesses_owner_id ON businesses(owner_id);
