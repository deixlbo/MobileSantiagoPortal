# Complete Setup Guide - Supabase Connection Fix

This guide walks you through setting up Supabase connections, including the newly fixed storage bucket system.

## Prerequisites

- Node.js 18+ installed
- pnpm package manager installed
- Supabase account with a project created
- Environment variables configured

## Environment Setup

### 1. Set Environment Variables

Create a `.env.local` file in the project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Optional: for local development with Supabase CLI
SUPABASE_LOCAL=false
```

**Where to find these values:**
1. Go to https://app.supabase.com/project/YOUR_PROJECT_ID/settings/api
2. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Install Dependencies

```bash
pnpm install
```

## Database Setup

### Option A: Automatic Setup (Recommended)

```bash
# Run complete setup (database + storage)
pnpm run setup
```

Or separately:
```bash
# Just database
pnpm run setup:db

# Just storage
pnpm run setup:storage
```

### Option B: Manual SQL Execution

1. Go to https://app.supabase.com/project/YOUR_PROJECT_ID/sql/new
2. Create a new query
3. Copy and paste the entire contents of `supabase-schema.sql`
4. Click "Run"
5. Then apply the storage migration from `supabase/migrations/20260609150000_create_storage_buckets.sql`

## Storage Bucket Setup

### What Gets Created

The storage setup creates:
- **Bucket Name:** `resident-uploads`
- **Type:** Private (requires authentication)
- **File Limit:** 10 MB per file
- **Allowed Types:** PDF, images (JPG, PNG), Word documents

### RLS Policies Applied

Automatic access control policies:
- Residents can upload their own documents
- Residents can read their own documents
- Officials/admins can read all documents
- Service role (backend) has full access
- Residents can delete their own files
- Admins can delete any files

## Verification Checklist

After running setup, verify everything works:

### ✓ Database Tables
```bash
# Check that tables exist
curl -s "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/profiles?limit=0" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -I
# Should return 200 OK
```

### ✓ Storage Bucket
1. Go to https://app.supabase.com/project/YOUR_PROJECT_ID/storage
2. You should see the `resident-uploads` bucket
3. Click it and verify it shows as private

### ✓ RLS Policies
1. Go to SQL Editor
2. Run: `SELECT * FROM storage.objects;`
3. Should return successfully (no "relation doesn't exist" error)

## Quick Start

Once setup is complete:

```bash
# Start development server
pnpm run dev

# Navigate to http://localhost:3000
# Test features:
# - User registration with ID upload
# - Document request submission
# - File uploads
```

## Troubleshooting

### "Bucket 'resident-uploads' does not exist"
**Solution:**
```bash
# Re-run storage setup
pnpm run setup:storage
```

### "Permission denied" on file upload
**Check:**
1. User is logged in
2. Environment variables are correct
3. RLS policies are applied
**Fix:**
```bash
# Re-apply RLS policies
pnpm run setup:storage
```

### "SUPABASE_SERVICE_ROLE_KEY is missing"
**Solution:**
1. Check `.env.local` has the key
2. Get it from: https://app.supabase.com/project/YOUR_PROJECT_ID/settings/api
3. Copy the `service_role secret` value
4. Add to `.env.local`
5. Restart dev server

### Tables don't exist after setup
**Solution:**
1. Manually run `supabase-schema.sql` via SQL Editor
2. Then run `pnpm run setup:storage`

## File Structure

```
supabase/
  ├── migrations/
  │   ├── 20260608094625_create_update_function_and_migrate_appointments.sql
  │   ├── 20260609000000_add_relationship_hints.sql
  │   ├── 20260609120000_fix_announcements_rls_policy.sql
  │   └── 20260609150000_create_storage_buckets.sql  ← Storage setup
  └── ...

lib/
  ├── supabase.ts          ← Client configuration
  ├── storage.ts           ← Storage utilities (NEW/UPDATED)
  ├── auth.ts              ← Authentication & registration
  └── ...

scripts/
  ├── setup-db.mjs         ← Database setup
  ├── setup-storage.mjs    ← Storage setup (NEW)
  └── ...
```

## Development Tips

### Test File Upload
```javascript
// In browser console or client component
import { uploadFile } from '@/lib/storage'

const file = new File(['test'], 'test.txt', { type: 'text/plain' })
const { data, error } = await uploadFile('documents/user-id/doc-id/test.txt', file)
console.log(data, error)
```

### View Storage Usage
Go to https://app.supabase.com/project/YOUR_PROJECT_ID/storage to see:
- Total storage used
- Files uploaded
- Bandwidth used

### Local Development with Supabase CLI
```bash
# Install Supabase CLI
brew install supabase/tap/supabase

# Start local Supabase
supabase start

# Stop local Supabase
supabase stop
```

## Next Steps

After successful setup:
1. Create admin account (role: admin)
2. Create official accounts (role: official)
3. Test resident registration workflow
4. Verify document upload functionality
5. Test approval workflow

## Support

For issues with Supabase setup:
- See [STORAGE_BUCKET_FIX.md](STORAGE_BUCKET_FIX.md) for storage-specific issues
- Check [DATABASE_SETUP.md](DATABASE_SETUP.md) for database issues
- Review Supabase docs: https://supabase.com/docs
