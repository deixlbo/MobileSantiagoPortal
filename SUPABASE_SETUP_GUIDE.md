# Supabase Database Setup Guide

## Overview
This guide walks you through setting up your Supabase database for the Mobile Santiago Portal.

## Step 1: Run the SQL Schema

1. Go to your Supabase project: https://supabase.com/dashboard/project/YOUR-PROJECT-ID
2. Navigate to **SQL Editor** in the left sidebar
3. Click **"New Query"**
4. Copy the entire contents of `/sql/schema.sql` from this repository
5. Paste it into the SQL editor
6. Click **"Run"** button

This will create:
- 10 tables with proper relationships
- Indexes for performance
- Row Level Security (RLS) policies
- Automatic timestamp triggers

## Step 2: Create Storage Buckets

After running the SQL, create two storage buckets:

### Bucket 1: resident-uploads
1. Go to **Storage** in left sidebar
2. Click **"Create a new bucket"**
3. Name: `resident-uploads`
4. Uncheck "Public bucket" (keep private)
5. Click **"Create bucket"**

### Bucket 2: announcements
1. Click **"Create a new bucket"** again
2. Name: `announcements`
3. Uncheck "Public bucket" (keep private)
4. Click **"Create bucket"**

## Step 3: Set Storage Permissions

For `resident-uploads` bucket:
1. Click the bucket name
2. Click **"Policies"** tab
3. Click **"New policy"**
4. Choose **"For full customization, use custom policies"**
5. Create INSERT policy:
   - Name: "Users can upload files"
   - Paste this policy:
   ```sql
   (
     (
       (storage.foldername(name))[1] = auth.uid()::text
     ) OR (
       EXISTS (
         SELECT 1
         FROM profiles
         WHERE (id = auth.uid())
           AND (role = 'admin'::text)
       )
     )
   )
   ```
6. Create SELECT policy:
   - Name: "Users can view their files"
   - Paste this policy:
   ```sql
   (
     (
       (storage.foldername(name))[1] = auth.uid()::text
     ) OR (
       EXISTS (
         SELECT 1
         FROM profiles
         WHERE (id = auth.uid())
           AND (role = 'admin'::text)
       )
     )
   )
   ```

## Step 4: Verify All Tables

After setup, verify everything is working:

1. Go to **SQL Editor**
2. Run this query:
   ```sql
   SELECT tablename FROM pg_tables 
   WHERE schemaname = 'public' 
   ORDER BY tablename;
   ```

You should see these tables:
- announcements
- audit_logs
- complaints
- document_requests
- file_uploads
- household_members
- households
- notifications
- payments
- profiles

## Step 5: Test the Connection from Code

Run the test suite:
```bash
npx tsx scripts/test-crud-operations.ts
```

This will verify:
- Database connection works
- All tables are accessible
- CRUD operations function correctly
- Timestamps are being set

## Tables Overview

### profiles
Stores all users (admins and residents) with authentication data.
- Columns: 19 (id, email, role, name fields, verification_status, etc.)
- Primary Key: id (UUID, linked to auth.users)
- Indexes: role, email, verification_status, created_at

### document_requests
Tracks all document requests from residents.
- Columns: 12 (id, resident_id, document_type, status, control_number, etc.)
- Primary Key: id (UUID)
- Foreign Keys: resident_id → profiles.id, issued_by → profiles.id

### notifications
Stores notifications for all users.
- Columns: 8 (id, user_id, title, message, type, link, read, timestamps)
- Primary Key: id (UUID)
- Foreign Key: user_id → profiles.id

### file_uploads
Metadata for all uploaded files (stored in Blob storage).
- Columns: 7 (id, resident_id, file_name, file_type, blob_url, upload_type, timestamps)
- Primary Key: id (UUID)
- Foreign Key: resident_id → profiles.id

### complaints
Stores complaints/blotters from residents.
- Columns: 10 (id, resident_id, category, title, description, status, priority, etc.)
- Primary Key: id (UUID)
- Foreign Keys: resident_id, assigned_to → profiles.id

### announcements
Public announcements posted by admins.
- Columns: 7 (id, title, content, posted_by, status, featured, image_url, timestamps)
- Primary Key: id (UUID)
- Foreign Key: posted_by → profiles.id

### households
Tracks household groups in the barangay.
- Columns: 6 (id, head_of_household_id, purok, address, total_members, timestamps)
- Primary Key: id (UUID)
- Foreign Key: head_of_household_id → profiles.id

### household_members
Individual members within a household.
- Columns: 7 (id, household_id, resident_id, first_name, last_name, relationship, date_of_birth, created_at)
- Primary Key: id (UUID)
- Foreign Keys: household_id → households.id, resident_id → profiles.id

### audit_logs
Complete audit trail of all system actions.
- Columns: 8 (id, user_id, action, entity_type, entity_id, changes, ip_address, user_agent, created_at)
- Primary Key: id (UUID)
- Foreign Key: user_id → profiles.id

### payments
Payment tracking for document requests (future use).
- Columns: 10 (id, resident_id, document_request_id, amount, status, payment_method, reference_number, paid_at, timestamps)
- Primary Key: id (UUID)
- Foreign Keys: resident_id, document_request_id → profiles.id, document_requests.id

## Row Level Security (RLS)

RLS is enabled on all tables. Policies ensure:
- Residents only see their own data
- Admins can see all data
- Automatic enforcement at database level
- No unauthorized data access

## Troubleshooting

### "No tables found"
1. Verify you ran the SQL script completely
2. Check for errors in the SQL editor output
3. Try running the schema.sql again

### "Table already exists"
Drop tables first:
```sql
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS file_uploads CASCADE;
DROP TABLE IF EXISTS household_members CASCADE;
DROP TABLE IF EXISTS households CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS complaints CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS document_requests CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
```

Then run schema.sql again.

### Bucket not showing in storage
1. Refresh the page
2. Check if buckets are private (not public)
3. Verify bucket names are lowercase with hyphens

### RLS policies not working
1. Verify RLS is enabled on the table
2. Check policy syntax is correct
3. Ensure auth.uid() is returning the right user ID
4. Test with admin user first (should bypass restrictions)

## Next Steps

1. ✓ Create tables (from schema.sql)
2. ✓ Create storage buckets
3. ✓ Set storage permissions
4. Run test suite
5. Create test admin user
6. Create test resident user
7. Test upload functionality
8. Deploy to production

## Support

If you encounter issues:
1. Check Supabase dashboard logs
2. Review error messages in the SQL editor
3. Verify all environment variables are set correctly
4. Test with curl/Postman before using the app
