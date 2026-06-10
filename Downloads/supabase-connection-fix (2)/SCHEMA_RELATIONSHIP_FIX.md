# Schema Relationship Error Fix

## Issue
Console Error: `"Could not find a relationship between 'document_requests' and 'profiles' in the schema cache"`

## Root Cause
The error occurs because Supabase's PostgREST API schema cache couldn't properly detect the foreign key relationships between tables due to:

1. **Missing explicit ON DELETE constraints** on some foreign keys (e.g., `approved_by`, `created_by`)
2. **Missing indexes** on foreign key columns used in relationships
3. **Schema cache staleness** - Supabase's introspection layer may not have refreshed after migrations

## Solution Applied

### 1. Updated Foreign Key Constraints
- Added explicit `ON DELETE SET NULL` constraints to foreign keys that don't define cascade behavior
- This ensures referential integrity and helps Supabase's relationship detection

**Tables Modified:**
- `document_requests`: `approved_by`, `created_by`
- `payments`: `processed_by`  
- `verification_documents`: `verified_by`

### 2. Added Missing Indexes
Created indexes on all foreign key columns used in relationships:
- `idx_document_requests_approved_by`
- `idx_document_requests_created_by`
- `idx_payments_processed_by`
- `idx_verification_documents_verified_by`

These indexes improve query performance and help Supabase's schema introspection.

### 3. Created Migration
Migration file: `supabase/migrations/20260609000000_add_relationship_hints.sql`

This migration:
- Recreates foreign key constraints with explicit names
- Adds missing indexes
- Runs VACUUM ANALYZE to refresh table statistics
- Updates schema cache

## How to Apply

### Option 1: Using Supabase Dashboard (Recommended)
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Navigate to your project → SQL Editor
3. Create a new query
4. Copy the contents of `supabase/migrations/20260609000000_add_relationship_hints.sql`
5. Execute the migration
6. Wait for completion (~5-10 seconds)

### Option 2: Using Supabase CLI
```bash
supabase db push
```

This will automatically apply all pending migrations.

### Option 3: Manual Setup (if using remote Supabase)
Connect to your Supabase database via psql and run the migration SQL manually.

## Verification

After applying the migration, refresh your browser and check:

1. **No more schema cache errors** - The console error should be gone
2. **fetchRequests works** - The document requests should load without errors
3. **All relationships resolve** - Any relationship-based queries should work properly

## Technical Details

### Relationship Names in Supabase
Supabase automatically creates relationship names based on foreign key column names:
- `resident_id` → relationship: `resident`
- `approved_by` → relationship: `approved_by`
- `created_by` → relationship: `created_by`
- `verified_by` → relationship: `verified_by`
- `processed_by` → relationship: `processed_by`

You can use these in relationship queries like:
```javascript
// Get document request with resident profile data
const { data } = await supabase
  .from('document_requests')
  .select('*, resident:resident_id(*)')
```

### Foreign Key Best Practices Applied
✅ All foreign keys now have explicit ON DELETE behavior
✅ All foreign key columns are indexed  
✅ Foreign key constraint names are explicit (helps debugging)
✅ Schema cache will be automatically refreshed after migration

## Files Modified
1. `supabase-schema.sql` - Updated table definitions
2. `supabase/migrations/20260609000000_add_relationship_hints.sql` - New migration

## Timeline
- Migration Date: 2026-06-09
- Expected Downtime: < 1 minute (during vacuum analyze)
- Rollback: Possible using Supabase Dashboard migration history
