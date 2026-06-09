# ✅ Supabase Configuration Complete

## Summary

Your **Mobile Santiago Portal** Supabase database is now fully configured and ready for production use!

### ✨ What's Configured

**✅ 20 Database Tables**
- User & Profile Management (profiles, households, household_members)
- Document System (document_requests, document_uploads, verification_documents)
- Incident Management (blotters, emergency_alerts)
- Communication (announcements, notifications, push_subscriptions)
- Administrative (projects, ordinances, assets, activity_logs, appointments)
- Payments & QR Codes (payments, qr_codes)
- Biometrics & OCR (resident_biometric, ocr_results)

**✅ Storage Bucket**
- Bucket Name: `resident-uploads`
- Max File Size: 50MB
- Allowed Types: PDF, JPEG, PNG
- Privacy: Private (authentication required)

**✅ Security**
- Row Level Security (RLS) enabled on all tables
- Role-based access control policies
- Helper functions for permission checks
- Automatic timestamp management

**✅ Environment Variables**
All required environment variables are already set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `POSTGRES_URL`

---

## 🔧 Database Features

### User Roles & Access Control

**Residents (verified users)**
- ✓ View own profile
- ✓ Submit document requests
- ✓ File blotter reports (complaints)
- ✓ Make appointments
- ✓ View own records
- ✗ Cannot access other residents' data

**Officials (barangay staff)**
- ✓ View all resident data
- ✓ Approve/reject document requests
- ✓ Manage all blotter reports
- ✓ Create announcements
- ✓ Manage projects
- ✓ Publish ordinances
- ✓ View all records

**Admins (system administrators)**
- ✓ Full access to all data
- ✓ Manage user accounts
- ✓ View activity logs
- ✓ System configuration
- ✓ Manage all records

### Table Descriptions

**Core Tables**

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `profiles` | User accounts | id, email, role, verification_status |
| `households` | Family units | id, name, address, member_count |
| `household_members` | Family members | household_id, member_id, relationship |

**Document Management**

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `document_requests` | Document requests | id, resident_id, document_type, status |
| `document_uploads` | File uploads | id, document_request_id, file_path |
| `verification_documents` | ID verification | id, resident_id, document_type, verified |
| `qr_codes` | Document verification QR codes | id, document_request_id, code |

**Incident & Communication**

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `blotters` | Incident reports | id, resident_id, case_number, status |
| `announcements` | Public announcements | id, title, status, priority |
| `emergency_alerts` | Crisis alerts | id, alert_type, severity_level |
| `notifications` | User notifications | id, user_id, type, read |

**Administrative**

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `projects` | Development projects | id, title, status, progress |
| `ordinances` | Laws & regulations | id, title, file_path |
| `assets` | Inventory | id, name, quantity, status |
| `appointments` | Booking system | id, resident_id, scheduled_at |
| `payments` | Payment records | id, resident_id, amount, status |
| `activity_logs` | Audit trail | id, user_id, action, details |
| `resident_biometric` | Biometric data | id, resident_id, fingerprint_data |
| `ocr_results` | ID scanning | id, document_id, extracted_data |
| `push_subscriptions` | Push notifications | id, user_id, endpoint |

---

## 📝 Usage Examples

### 1. Create a Document Request

```typescript
import { supabase } from '@/lib/supabase'

const { data, error } = await supabase
  .from('document_requests')
  .insert([{
    resident_id: userId,
    document_type: 'barangay_clearance',
    purpose: 'Travel document',
    status: 'pending'
  }])
  .select()
  .single()
```

### 2. Upload a File

```typescript
const { data, error } = await supabase.storage
  .from('resident-uploads')
  .upload(`${ID_STORAGE_PREFIX}/${userId}/${file.name}`, file, {
    contentType: file.type,
    cacheControl: '3600'
  })

// Get public URL
const { data: publicUrl } = supabase.storage
  .from('resident-uploads')
  .getPublicUrl(`${ID_STORAGE_PREFIX}/${userId}/${file.name}`)
```

### 3. Query Resident Profile

```typescript
const { data: profile, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .eq('verification_status', 'verified')
  .single()
```

### 4. Check User Role

```typescript
const { data: user, error } = await supabase.auth.getUser()
const role = user?.user_metadata?.role // 'admin', 'official', or 'resident'
```

### 5. Real-Time Subscription

```typescript
supabase
  .from('document_requests')
  .on('*', (payload) => {
    console.log('Change received!', payload)
  })
  .subscribe()
```

### 6. File Blotter Report

```typescript
const { data, error } = await supabase
  .from('blotters')
  .insert([{
    resident_id: userId,
    case_number: generateCaseNumber(),
    type: 'dispute',
    complainant: 'John Doe',
    respondent: 'Jane Smith',
    description: 'Property boundary dispute'
  }])
```

---

## 🔐 Security Notes

1. **Row Level Security (RLS)** is enabled on all tables
   - Users can only see their own data by default
   - Officials can see all data within their scope
   - Admins have full access

2. **Authentication Required**
   - All database operations require valid Supabase auth
   - Service role key available for server operations only

3. **File Storage**
   - Files in `resident-uploads` require authentication
   - 50MB file size limit
   - Only PDF, JPEG, PNG allowed

4. **Audit Trail**
   - All actions logged in `activity_logs`
   - User IPs and user agents recorded
   - Timestamps automatically managed

---

## ✅ Verification Checklist

- [x] Supabase connection established
- [x] 20 tables created
- [x] Row Level Security enabled
- [x] Storage bucket configured
- [x] Environment variables set
- [x] Helper functions available
- [x] Automatic triggers configured
- [x] Sample data ready for insertion

---

## 🚀 Ready to Use!

Your database is fully configured. You can now:

1. **Sign up residents** via `/auth/signup`
2. **Request documents** via the resident portal
3. **File blotter reports** for incidents
4. **Upload verification documents** for ID verification
5. **Manage approvals** via the official dashboard
6. **View analytics** via admin dashboard

All data fetching, storing, uploading, and querying are fully configured and ready! 🎉

---

## 📞 Next Steps

1. ✅ Database schema deployed
2. ✅ Tables created with proper relationships
3. ✅ Security policies applied
4. ✅ Storage buckets configured
5. → Start using the Portal!

The Supabase connection is complete and your application is ready for production use.
