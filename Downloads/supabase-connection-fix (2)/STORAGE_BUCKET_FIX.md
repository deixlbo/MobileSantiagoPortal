# Supabase Storage Bucket Fix

## Issue
The application was attempting to upload files to a `resident-uploads` storage bucket in Supabase, but the bucket was not being created during setup. This caused file upload failures when residents tried to submit documents or upload ID verification files.

## Root Cause
The initial database setup only created tables and RLS policies but did not create the Supabase Storage buckets. Storage buckets need to be explicitly created through Supabase's Storage API, not through standard SQL migrations.

## Solution

### What Was Added

#### 1. **Storage Migration** (`supabase/migrations/20260609150000_create_storage_buckets.sql`)
- Creates the `resident-uploads` bucket with proper configuration
- Sets up Row Level Security (RLS) policies for the storage bucket
- Ensures proper access control:
  - Service role (backend) has full access
  - Residents can upload and access their own documents
  - Officials/admins can read all resident documents
  - Residents can delete their own documents
  - Admins can delete any documents

#### 2. **Enhanced Storage Utilities** (`lib/storage.ts`)
New utility functions for managing storage:
- `initializeStorageBuckets()` - Automatically creates buckets if they don't exist
- `uploadFile()` - Upload files to the bucket
- `downloadFile()` - Download files from the bucket
- `deleteFile()` - Delete single files
- `deleteFiles()` - Delete multiple files
- `listFiles()` - List files in a directory
- `getPublicUrl()` - Generate public URLs for files

#### 3. **Storage Setup Script** (`scripts/setup-storage.mjs`)
New script to initialize storage buckets:
```bash
# Run with environment variables set
NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... pnpm exec node scripts/setup-storage.mjs
```

## Implementation Steps

### For Fresh Setup:
1. Ensure environment variables are set:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. Run the storage setup script:
   ```bash
   pnpm exec node scripts/setup-storage.mjs
   ```

3. Verify the bucket exists in Supabase:
   - Go to https://app.supabase.com/project/YOUR_PROJECT_ID/storage
   - Look for the `resident-uploads` bucket
   - Ensure it's marked as private (not public)

### For Existing Deployments:

#### Option A: Manual SQL Execution
1. Go to SQL Editor in Supabase dashboard
2. Create new query
3. Copy contents of `supabase/migrations/20260609150000_create_storage_buckets.sql`
4. Execute the query

#### Option B: Using the Setup Script
```bash
# Set your Supabase credentials
export NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"

# Run setup
pnpm exec node scripts/setup-storage.mjs
```

#### Option C: Manual UI Creation (If Automated Methods Fail)
1. Go to Storage in Supabase dashboard
2. Click "New bucket"
3. Name: `resident-uploads`
4. Uncheck "Public bucket" (make it private)
5. Leave file size limit blank or set to 10 MB
6. Create the bucket
7. Then manually apply the RLS policies from the migration file via SQL Editor

## Verification

### Check If Bucket Exists:
```bash
# Lists all storage buckets
NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node -e "
import { createClient } from '@supabase/supabase-js';
const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
client.storage.listBuckets().then(r => console.log(JSON.stringify(r, null, 2)));
"
```

### Test Upload:
```bash
# In the application, try uploading a file through:
# - Resident registration (ID verification)
# - Document request submission
# Check browser console for any storage errors
```

## Files Modified/Created

| File | Change | Purpose |
|------|--------|---------|
| `supabase/migrations/20260609150000_create_storage_buckets.sql` | ✨ NEW | Storage bucket creation and RLS policies |
| `lib/storage.ts` | 🔄 UPDATED | Enhanced with bucket utilities |
| `scripts/setup-storage.mjs` | ✨ NEW | Storage initialization script |

## RLS Policy Details

The storage bucket uses these policies:

1. **Service Role Full Access** - Allows backend operations
2. **Residents Upload Own** - Residents can upload to `documents/{residentId}/{documentId}/`
3. **Residents Read Own** - Residents can read their own documents
4. **Officials/Admins Read All** - Officials and admins can read any resident's documents
5. **Residents Delete Own** - Residents can delete their own documents
6. **Admins Delete Any** - Admins can delete any documents

## Integration with Existing Code

The changes integrate seamlessly:

- **Document Upload** (`app/api/documents/upload/route.ts`) - Already uses `RESIDENT_UPLOAD_BUCKET`
- **Registration** (`lib/auth.ts`) - Already uploads ID files to storage
- **Document Requests** (`app/resident/documents/page.tsx`) - Can now generate QR codes for pickup

## Troubleshooting

### "Bucket doesn't exist" Error
- Verify bucket was created: `pnpm exec node scripts/setup-storage.mjs`
- Check Supabase dashboard Storage tab
- Run manual setup if automated method fails

### "Permission denied" Error
- Check RLS policies are applied correctly
- Verify `SUPABASE_SERVICE_ROLE_KEY` has sufficient permissions
- Ensure storage path format matches policy: `documents/{residentId}/{documentId}/{filename}`

### "File size exceeds limit" Error
- Bucket limit is 10 MB
- Check file size before upload
- Adjust limit in migration if needed

## Future Enhancements

- Add versioning for uploaded documents
- Implement document expiration/archival
- Add virus scanning for uploads
- Implement document signing/certification workflow
