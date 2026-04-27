-- Insert sample users with known credentials
-- Password hashing is done with SHA-256 in the app
-- Sample passwords (as SHA-256 hashes for reference):
-- "password123" = e9d71f5ee7c92d6dc9e92ffdad17b8bd49418661cb199c8d7879f7c68d6991c0
-- "admin123" = 0ecca2e3ad0368cb11d72f65b2eca38973e37b56218ff tajuan88c51da1ecfffa1
-- "resident123" = 9f9d51bc70debfdfefb70e9500bfec047bbc72f5fef3e9c16f04b8b5d0e9c7ba

-- Admin user
INSERT INTO users (id, email, password_hash, full_name, contact_number, user_type, status, is_activated, created_at)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'admin@santiago.gov.ph',
  'e9d71f5ee7c92d6dc9e92ffdad17b8bd49418661cb199c8d7879f7c68d6991c0',
  'Admin Santiago',
  '09123456789',
  'admin',
  'active',
  TRUE,
  NOW()
);

-- Resident 1
INSERT INTO users (id, email, password_hash, full_name, contact_number, user_type, status, is_activated, created_at)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'juan.dela.cruz@email.com',
  'e9d71f5ee7c92d6dc9e92ffdad17b8bd49418661cb199c8d7879f7c68d6991c0',
  'Juan Dela Cruz',
  '09987654321',
  'resident',
  'active',
  TRUE,
  NOW()
);

-- Resident 2
INSERT INTO users (id, email, password_hash, full_name, contact_number, user_type, status, is_activated, created_at)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  'maria.santos@email.com',
  'e9d71f5ee7c92d6dc9e92ffdad17b8bd49418661cb199c8d7879f7c68d6991c0',
  'Maria Santos',
  '09876543210',
  'resident',
  'active',
  TRUE,
  NOW()
);

-- Official 1
INSERT INTO users (id, email, password_hash, full_name, contact_number, user_type, status, is_activated, created_at)
VALUES (
  '44444444-4444-4444-4444-444444444444',
  'mayor@santiago.gov.ph',
  'e9d71f5ee7c92d6dc9e92ffdad17b8bd49418661cb199c8d7879f7c68d6991c0',
  'Barangay Captain Ramon Cruz',
  '09111111111',
  'official',
  'active',
  TRUE,
  NOW()
);

-- Official 2
INSERT INTO users (id, email, password_hash, full_name, contact_number, user_type, status, is_activated, created_at)
VALUES (
  '55555555-5555-5555-5555-555555555555',
  'secretary@santiago.gov.ph',
  'e9d71f5ee7c92d6dc9e92ffdad17b8bd49418661cb199c8d7879f7c68d6991c0',
  'Barangay Secretary Maria Reyes',
  '09222222222',
  'official',
  'active',
  TRUE,
  NOW()
);

-- Insert resident profiles
INSERT INTO residents (user_id, purok, address, birth_date, gender, civil_status, occupation, created_at)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'Purok 1',
  '123 Main Street, Barangay Santiago',
  '1985-06-15',
  'Male',
  'Married',
  'Engineer',
  NOW()
);

INSERT INTO residents (user_id, purok, address, birth_date, gender, civil_status, occupation, created_at)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  'Purok 2',
  '456 Oak Avenue, Barangay Santiago',
  '1992-03-22',
  'Female',
  'Single',
  'Teacher',
  NOW()
);

-- Insert official profiles
INSERT INTO officials (user_id, position, department, office_phone, created_at)
VALUES (
  '44444444-4444-4444-4444-444444444444',
  'Barangay Captain',
  'Executive',
  '(02) 1234-5678',
  NOW()
);

INSERT INTO officials (user_id, position, department, office_phone, created_at)
VALUES (
  '55555555-5555-5555-5555-555555555555',
  'Barangay Secretary',
  'Administrative',
  '(02) 1234-5679',
  NOW()
);

-- Insert sample announcements
INSERT INTO announcements (id, title, content, category, created_by, published_at, created_at)
VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Spring Barangay Assembly',
  'You are cordially invited to the Spring Barangay Assembly on April 15, 2026 at 2:00 PM at the Barangay Hall. All residents are welcome to attend.',
  'Event',
  '44444444-4444-4444-4444-444444444444',
  NOW(),
  NOW()
);

INSERT INTO announcements (id, title, content, category, created_by, published_at, created_at)
VALUES (
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Road Repair Schedule',
  'Scheduled road repairs on Main Street from April 20-25, 2026. Please expect minor traffic disruptions during working hours 7:00 AM to 5:00 PM.',
  'Infrastructure',
  '44444444-4444-4444-4444-444444444444',
  NOW(),
  NOW()
);

INSERT INTO announcements (id, title, content, category, created_by, published_at, created_at)
VALUES (
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'Health and Wellness Program',
  'Free health checkup and vaccination clinic every Saturday at the Barangay Health Center. No appointment needed. Bring your ID.',
  'Health',
  '55555555-5555-5555-5555-555555555555',
  NOW(),
  NOW()
);

-- Insert sample documents
INSERT INTO documents (id, title, description, document_type, uploaded_by, is_public, created_at)
VALUES (
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  '2026 Barangay Budget',
  'Annual budget allocation for the year 2026',
  'Budget',
  '44444444-4444-4444-4444-444444444444',
  TRUE,
  NOW()
);

INSERT INTO documents (id, title, description, document_type, uploaded_by, is_public, created_at)
VALUES (
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  'Barangay Code of Conduct',
  'Rules and regulations for all barangay residents',
  'Ordinance',
  '55555555-5555-5555-5555-555555555555',
  TRUE,
  NOW()
);

-- Insert sample blotter entries
INSERT INTO blotter (id, incident_date, incident_type, location, description, reported_by, status, created_at)
VALUES (
  'ffffffff-ffff-ffff-ffff-ffffffffffff',
  NOW() - INTERVAL '5 days',
  'Lost and Found',
  'Barangay Market',
  'Lost wallet with identification and cash. Contact barangay office if found.',
  '22222222-2222-2222-2222-222222222222',
  'open',
  NOW()
);

INSERT INTO blotter (id, incident_date, incident_type, location, description, reported_by, status, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  NOW() - INTERVAL '3 days',
  'Noise Complaint',
  'Oak Avenue',
  'Excessive noise from construction activities during evening hours',
  '33333333-3333-3333-3333-333333333333',
  'under_investigation',
  NOW()
);

-- Insert sample ordinances
INSERT INTO ordinances (id, title, content, ordinance_number, effective_date, created_by, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'Environmental Protection Ordinance',
  'This ordinance shall establish guidelines for environmental protection and waste management in Barangay Santiago.',
  'ORD-2026-001',
  '2026-04-01',
  '44444444-4444-4444-4444-444444444444',
  NOW()
);

INSERT INTO ordinances (id, title, content, ordinance_number, effective_date, created_by, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000003',
  'Public Health and Safety Code',
  'This ordinance establishes standards for public health and safety measures within the barangay.',
  'ORD-2026-002',
  '2026-03-15',
  '44444444-4444-4444-4444-444444444444',
  NOW()
);

-- Insert sample projects
INSERT INTO projects (id, title, description, start_date, end_date, budget, status, created_by, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000004',
  'Community Basketball Court Renovation',
  'Complete renovation and upgrade of the existing basketball court facility',
  '2026-05-01',
  '2026-08-31',
  150000.00,
  'planning',
  '44444444-4444-4444-4444-444444444444',
  NOW()
);

INSERT INTO projects (id, title, description, start_date, end_date, budget, status, created_by, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000005',
  'Barangay Road Improvement',
  'Asphalting and maintenance of main barangay roads',
  '2026-04-15',
  '2026-06-30',
  500000.00,
  'in_progress',
  '44444444-4444-4444-4444-444444444444',
  NOW()
);

-- Insert sample assets
INSERT INTO assets (id, name, asset_type, description, location, acquisition_date, value, status, created_by, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000006',
  'Barangay Hall Building',
  'Real Estate',
  'Main administrative building of the barangay',
  'Center of Barangay Santiago',
  '2015-01-15',
  5000000.00,
  'active',
  '44444444-4444-4444-4444-444444444444',
  NOW()
);

INSERT INTO assets (id, name, asset_type, description, location, acquisition_date, value, status, created_by, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000007',
  'Ambulance',
  'Vehicle',
  'Emergency response vehicle for medical assistance',
  'Barangay Health Center',
  '2022-06-20',
  450000.00,
  'active',
  '44444444-4444-4444-4444-444444444444',
  NOW()
);

-- Insert sample businesses
INSERT INTO businesses (id, business_name, owner_id, business_type, location, permit_number, permit_expiry, status, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000008',
  'Juan&apos;s Electronics Store',
  '22222222-2222-2222-2222-222222222222',
  'Retail',
  '123 Main Street, Barangay Santiago',
  'BP-2026-001',
  '2027-04-20',
  'active',
  NOW()
);

INSERT INTO businesses (id, business_name, owner_id, business_type, location, permit_number, permit_expiry, status, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000009',
  'Maria&apos;s Catering Services',
  '33333333-3333-3333-3333-333333333333',
  'Food Service',
  '456 Oak Avenue, Barangay Santiago',
  'BP-2026-002',
  '2027-03-15',
  'active',
  NOW()
);
