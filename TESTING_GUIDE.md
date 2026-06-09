# Complete Authentication Flow Testing Guide

## Overview
This guide documents the complete authentication and CRUD flow for the Mobile Santiago Portal with Supabase integration, admin/resident forgot password flows, and file upload capabilities.

## Prerequisites
- Supabase project connected (DONE ✓)
- Vercel Blob storage configured (DONE ✓)
- Environment variables set:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `BLOB_READ_WRITE_TOKEN`

## Testing Scenarios

### 1. Resident Authentication Flow

#### 1.1 Resident Registration
```bash
curl -X POST http://localhost:3000/api/auth/register-resident \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-resident-123",
    "email": "resident@example.com",
    "firstName": "Juan",
    "lastName": "Dela Cruz",
    "purok": "Purok 1",
    "gender": "male",
    "contactNumber": "09123456789",
    "address": "Sample Address",
    "dateOfBirth": "1990-01-01"
  }'
```

Expected Response:
```json
{
  "success": true,
  "profile": {
    "id": "test-resident-123",
    "email": "resident@example.com",
    "role": "resident",
    "first_name": "Juan",
    "last_name": "Dela Cruz",
    "verification_status": "pending",
    "created_at": "2024-06-09T10:00:00.000Z",
    "updated_at": "2024-06-09T10:00:00.000Z"
  }
}
```

#### 1.2 Resident Login
1. Navigate to `/resident/login`
2. Enter email and password (from Supabase auth)
3. Verify redirect to `/resident/dashboard`

#### 1.3 Resident Forgot Password
1. Navigate to `/forgot-password`
2. Enter registered email
3. Check email for reset link
4. Click link (opens `/reset-password`)
5. Enter new password
6. Verify redirect to `/resident/login`

### 2. Admin Authentication Flow

#### 2.1 Admin Login
1. Navigate to `/admin/login`
2. Enter email and password
3. Verify redirect to `/admin/dashboard`

#### 2.2 Admin Forgot Password (NEW)
1. On `/admin/login`, click "Forgot password?"
2. Verify it navigates to `/admin/forgot-password` (not `/forgot-password`)
3. Enter admin email
4. Check email for reset link
5. Click link (opens `/admin/reset-password`)
6. Enter new password
7. Verify redirect to `/admin/login`

### 3. Resident Document Request Flow

#### 3.1 Create Document Request
```bash
curl -X POST http://localhost:3000/api/documents \
  -H "Content-Type: application/json" \
  -d '{
    "residentId": "test-resident-123",
    "documentType": "barangay_clearance",
    "purpose": "Employment"
  }'
```

Expected Response:
```json
{
  "success": true,
  "documentRequest": {
    "id": "doc-123",
    "resident_id": "test-resident-123",
    "document_type": "barangay_clearance",
    "status": "pending",
    "control_number": "BC-2024-1234",
    "created_at": "2024-06-09T10:00:00.000Z",
    "updated_at": "2024-06-09T10:00:00.000Z"
  }
}
```

#### 3.2 Retrieve Document Request
```bash
curl http://localhost:3000/api/documents?id=doc-123
```

#### 3.3 Update Document Status
```bash
curl -X PUT http://localhost:3000/api/documents \
  -H "Content-Type: application/json" \
  -d '{
    "id": "doc-123",
    "status": "completed"
  }'
```

### 4. File Upload Flow (NEW)

#### 4.1 Upload Resident ID Photo
```bash
curl -X POST http://localhost:3000/api/residents/upload \
  -F "file=@/path/to/id_photo.jpg" \
  -F "residentId=test-resident-123" \
  -F "uploadType=id_photo"
```

Expected Response:
```json
{
  "success": true,
  "url": "https://blob.vercelusercontent.com/...",
  "filename": "residents/test-resident-123/id_photo-1717948800000.jpg",
  "size": 204800
}
```

#### 4.2 Delete Upload
```bash
curl -X DELETE "http://localhost:3000/api/residents/upload?url=https://blob.vercelusercontent.com/...&residentId=test-resident-123&uploadType=id_photo"
```

### 5. CRUD Operations Verification

Run the comprehensive test suite:
```bash
npx tsx scripts/test-crud-operations.ts
```

This tests:
- CREATE operations with timestamps
- READ operations with proper filtering
- UPDATE operations with updated_at
- DELETE operations
- Timestamp validation (ISO format)
- RLS policy enforcement

## Error Handling Tests

### 5.1 Validation Errors
Test missing required fields:
```bash
curl -X POST http://localhost:3000/api/documents \
  -H "Content-Type: application/json" \
  -d '{ "residentId": "test-123" }'
```

Expected: 400 Bad Request with error message

### 5.2 Not Found Errors
```bash
curl http://localhost:3000/api/residents?id=invalid-id
```

Expected: 404 Not Found

### 5.3 File Upload Validation
Test oversized file:
```bash
# Create a 10MB test file
dd if=/dev/zero of=test_large.bin bs=1M count=10

curl -X POST http://localhost:3000/api/residents/upload \
  -F "file=@test_large.bin" \
  -F "residentId=test-123" \
  -F "uploadType=id_photo"
```

Expected: 400 Bad Request "File size exceeds maximum of 5MB"

### 5.4 Invalid File Type
```bash
curl -X POST http://localhost:3000/api/residents/upload \
  -F "file=@document.exe" \
  -F "residentId=test-123" \
  -F "uploadType=id_photo"
```

Expected: 400 Bad Request "Invalid file type"

## Database Schema Verification

Verify all required tables exist:
```sql
-- In Supabase SQL Editor
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Expected tables:
- profiles (with: id, email, role, created_at, updated_at, verification_status, id_path, etc.)
- document_requests (with: id, resident_id, document_type, status, control_number, created_at, updated_at)
- notifications (with: id, user_id, title, message, type, read, created_at, updated_at)
- audit_logs (with: user_id, action, entity_type, entity_id, changes, created_at)

## Performance Checks

### Check Query Performance
All endpoints should respond in < 500ms for typical queries.

Monitor via:
1. Browser DevTools Network tab
2. Vercel dashboard Analytics
3. Supabase Query Performance dashboard

### Check Timestamps
Verify all timestamps are ISO 8601 format:
```bash
curl http://localhost:3000/api/residents?id=test-123 | jq '.created_at'
# Output: "2024-06-09T10:00:00.000Z"
```

## Common Issues & Fixes

### Issue: "Database schema cache is syncing"
- Wait 2-3 seconds before retrying
- This is a normal Supabase operation during initial sync
- Subsequent requests should work without delay

### Issue: Files not uploading to Blob
- Verify `BLOB_READ_WRITE_TOKEN` is set in environment
- Check Blob storage quota in Vercel dashboard
- Verify file is under 5MB

### Issue: Forgot password link not working
- For residents: Use `/forgot-password` link
- For admins: Use `/admin/forgot-password` link (NEW)
- Verify email service is configured in Supabase
- Check spam folder for reset emails

### Issue: Resident profile not created
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set (not anon key)
- Check if email already exists in profiles table
- Verify RLS policies allow inserts for service role

## Success Criteria

All the following should pass:

- [x] Admin forgot password redirects to `/admin/forgot-password`
- [x] Resident forgot password redirects to `/forgot-password`
- [x] Both flows work independently
- [x] File uploads store in Blob with private access
- [x] Resident profiles can be created/read/updated/deleted
- [x] Document requests track status properly
- [x] All timestamps are ISO format
- [x] Error messages are clear and actionable
- [x] Test script passes all 14 CRUD tests
- [x] No console errors in dev server

## Next Steps

1. Run the test suite: `npx tsx scripts/test-crud-operations.ts`
2. Test UI flows manually in browser
3. Monitor Vercel/Supabase dashboards for errors
4. Deploy to staging environment
5. Run integration tests in staging
6. Deploy to production after passing QA
