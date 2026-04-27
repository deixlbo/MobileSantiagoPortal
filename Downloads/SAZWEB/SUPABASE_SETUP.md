# Supabase Setup Guide for Mobile Santiago Portal

This guide explains how to set up the Supabase database for the Mobile Santiago Portal with sample credentials and mock data.

## Database Setup

### Prerequisites
- Supabase project created and connected to this repository
- Environment variables configured (`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`)

### Schema Overview

The database consists of the following tables:

1. **users** - Central user management
   - Admin, Official, and Resident user types
   - Authentication credentials
   - Status tracking (pending, active, inactive, rejected)

2. **residents** - Resident-specific information
   - Purok assignment
   - Address, birth date, gender
   - Civil status and occupation

3. **officials** - Government official profiles
   - Position and department
   - Office contact information

4. **announcements** - Public announcements and notices
   - Categories (Event, Infrastructure, Health, etc.)
   - Publishing and expiration dates

5. **documents** - Shared documents and files
   - Barangay policies, budgets, ordinances
   - Public/private visibility

6. **blotter** - Incident reports and records
   - Incident types and status tracking
   - Location and detailed descriptions

7. **ordinances** - Barangay laws and regulations
   - Ordinance numbers and effective dates

8. **projects** - Development and infrastructure projects
   - Budget tracking and timeline
   - Project status (planning, in_progress, completed, cancelled)

9. **assets** - Barangay property and equipment
   - Asset type, location, and valuation
   - Acquisition and status tracking

10. **businesses** - Business registrations and permits
    - Business type and owner
    - Permit number and expiry tracking

## Sample Login Credentials

Use these accounts to test the application:

### Admin Account
```
Email: admin@santiago.gov.ph
Password: password123
User Type: Admin
Status: Active
```

### Official Account (Barangay Captain)
```
Email: mayor@santiago.gov.ph
Password: password123
User Type: Official
Position: Barangay Captain
Status: Active
```

### Official Account (Barangay Secretary)
```
Email: secretary@santiago.gov.ph
Password: password123
User Type: Official
Position: Barangay Secretary
Status: Active
```

### Resident Account 1
```
Email: juan.dela.cruz@email.com
Password: password123
User Type: Resident
Name: Juan Dela Cruz
Status: Active
```

### Resident Account 2
```
Email: maria.santos@email.com
Password: password123
User Type: Resident
Name: Maria Santos
Status: Active
```

## Password Hash Reference

The seed data uses SHA-256 hashing for passwords. All sample passwords hash to:
```
Password: password123
Hash: e9d71f5ee7c92d6dc9e92ffdad17b8bd49418661cb199c8d7879f7c68d6991c0
```

When implementing password verification in the application, ensure you're using the same hashing algorithm (SHA-256).

## Sample Data Included

### Mock Announcements
- Spring Barangay Assembly
- Road Repair Schedule
- Health and Wellness Program

### Mock Blotter Entries
- Lost wallet incident
- Noise complaint

### Mock Ordinances
- Environmental Protection Ordinance
- Public Health and Safety Code

### Mock Projects
- Community Basketball Court Renovation
- Barangay Road Improvement

### Mock Assets
- Barangay Hall Building
- Emergency Ambulance

### Mock Businesses
- Juan's Electronics Store
- Maria's Catering Services

## Setting Up the Database

### Option 1: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Open the SQL Editor
3. Copy and paste the contents of `scripts/01_schema.sql`
4. Run the query
5. Then copy and paste `scripts/02_seed_data.sql`
6. Run the query

### Option 2: Using the Setup Script

```bash
cd artifacts/barangay-portal
npm install
node ../../scripts/setup-db.js
```

## Testing the Connection

After setup, verify the database is working by:

1. Checking that all tables are created in the Supabase Dashboard
2. Using the login credentials above in the application
3. Viewing the mock data in the Supabase dashboard

## Important Notes

- All passwords in the seed data use the same test password for simplicity
- These are NOT secure for production use
- Before deploying to production, change all sample credentials
- Implement proper password hashing (bcrypt or similar) for production
- Enable Row Level Security (RLS) policies for production
- All user IDs are hardcoded UUIDs for consistent testing

## Database Relationships

```
users (base table)
├── residents (1:1 with users)
├── officials (1:1 with users)
├── announcements (created_by references users)
├── documents (uploaded_by references users)
├── blotter (reported_by references users)
├── ordinances (created_by references users)
├── projects (created_by references users)
├── assets (created_by references users)
└── businesses (owner_id references users)
```

## Row Level Security (RLS)

For production, implement RLS policies to ensure:
- Residents can only view their own data
- Officials can view resident data as needed
- Admins have full access
- Public documents are visible to all authenticated users

## Next Steps

1. Set up authentication in the application
2. Implement RLS policies in Supabase
3. Create proper production credentials
4. Test all CRUD operations
5. Implement proper error handling
6. Deploy to Vercel
