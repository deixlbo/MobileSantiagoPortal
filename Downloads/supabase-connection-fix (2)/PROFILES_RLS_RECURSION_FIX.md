# Fix: Infinite Recursion in Profiles RLS Policy

## Problem
**Error:** `infinite recursion detected in policy for relation "profiles"`

This error occurs when trying to fetch user profiles via `getProfile()` function, which executes:
```typescript
const { data: profile, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', uid)
  .single()
```

## Root Cause
Two RLS policies on the `profiles` table were attempting to read the `role` column to evaluate their own conditions:

```sql
-- PROBLEMATIC POLICIES (removed):
CREATE POLICY "Authenticated users can view official profiles" ON profiles
  FOR SELECT USING (role = 'official' AND auth.uid() IS NOT NULL);

CREATE POLICY "Public can view official profiles" ON profiles
  FOR SELECT USING (role = 'official');
```

### Why This Causes Recursion
1. Client requests: `SELECT * FROM profiles WHERE id = <user_id>`
2. Supabase evaluates RLS policies on each row
3. Policy needs to evaluate `role = 'official'` condition
4. This requires **reading** the `role` column from the profiles table
5. Reading from profiles table triggers RLS policy evaluation again
6. **Circular dependency** → Infinite recursion

## Solution
The fix involved:

### 1. **Removed Problematic Policies**
- Deleted "Authenticated users can view official profiles"
- Deleted "Public can view official profiles"

### 2. **Added SECURITY DEFINER Helper Function**
Created a function that bypasses RLS to safely check profile roles:

```sql
CREATE OR REPLACE FUNCTION is_official_profile(profile_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role IN ('official', 'admin') FROM profiles WHERE id = profile_id;
$$;
```

**Why this works:** Functions with `SECURITY DEFINER` execute with the function owner's privileges (usually `postgres`), bypassing RLS. This allows safe reads from the table without triggering infinite recursion.

### 3. **Added Safe Policy Using Helper**
Created a new policy that uses the SECURITY DEFINER function:

```sql
CREATE POLICY "Users can view official profiles" ON profiles
  FOR SELECT USING (is_official_profile(id));
```

## Current RLS Policies (After Fix)
The profiles table now has these safe policies:

```sql
-- Users can see their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Admins can see all profiles
CREATE POLICY "Admins view all profiles" ON profiles
  FOR SELECT USING (is_admin());

-- Anyone can see official/admin profiles
CREATE POLICY "Users can view official profiles" ON profiles
  FOR SELECT USING (is_official_profile(id));

-- Users can create their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Admins can create profiles
CREATE POLICY "Admins can insert profiles" ON profiles
  FOR INSERT WITH CHECK (is_admin());

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (is_admin());
```

## Applying the Fix

### Option 1: SQL Editor (Recommended for Quick Test)
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Navigate to your project
3. Go to **SQL Editor**
4. Create a new query
5. Copy the following SQL:

```sql
-- Add the helper function
CREATE OR REPLACE FUNCTION is_official_profile(profile_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role IN ('official', 'admin') FROM profiles WHERE id = profile_id;
$$;

-- Drop the recursive policies
DROP POLICY IF EXISTS "Authenticated users can view official profiles" ON profiles;
DROP POLICY IF EXISTS "Public can view official profiles" ON profiles;

-- Add safe policies
CREATE POLICY "Users can view official profiles" ON profiles
  FOR SELECT USING (is_official_profile(id));
```

6. Click **Run** to execute

### Option 2: Database Migration
Add a new migration file to `supabase/migrations/`:

```bash
# Create migration
touch supabase/migrations/20260609_fix_profiles_rls_recursion.sql
```

Copy the SQL from Option 1 into the migration file, then:

```bash
supabase db push
```

### Option 3: Manual Update from Schema File
If using the complete schema file:

```bash
# Backup current schema
cp supabase-schema.sql supabase-schema.sql.backup

# Apply the updated schema (be careful with this approach)
# This should only be done if no other changes are in production
```

## Verification

After applying the fix, test that the error is resolved:

### 1. **Browser Console Test**
- Open your app
- Go to any page that calls `getProfile()` (e.g., Resident Documents, Profile page)
- Open browser DevTools (F12)
- Check Console tab - should NOT see the "infinite recursion" error

### 2. **Direct Supabase Test**
```javascript
// In browser console or a test file
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_ANON_KEY'
)

const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .limit(1)

console.log('Success:', data)
console.log('Error:', error)
```

### 3. **Check Policies in Dashboard**
1. Go to Supabase Dashboard
2. **Authentication** → **Policies**
3. Select `profiles` table
4. Verify policies:
   - ✅ "Users can view own profile"
   - ✅ "Admins view all profiles"
   - ✅ "Users can view official profiles" (NEW)
   - ❌ "Authenticated users can view official profiles" (REMOVED)
   - ❌ "Public can view official profiles" (REMOVED)

## Impact Analysis

### What Changed
- **Removed:** 2 recursive policies
- **Added:** 1 helper function with SECURITY DEFINER
- **Added:** 1 new safe policy

### What Still Works
- ✅ Users can see their own profile
- ✅ Users can see official/admin profiles
- ✅ Admins can see all profiles
- ✅ Authentication checks still work
- ✅ All other RLS policies unaffected

### Potential Issues
- None identified. The fix maintains the same functionality while preventing recursion.

## Technical Details

### Why SECURITY DEFINER Works
- **Without SECURITY DEFINER:** Function runs with caller's permissions, triggering RLS
- **With SECURITY DEFINER:** Function runs as the database owner (`postgres`), bypassing RLS
- **Result:** The function can safely read from the table without circular dependency

### Why We Can't Just Use JWT
The original idea was to check roles via JWT (`auth.jwt() -> 'user_metadata' ->> 'role'`), but that only works when:
1. The JWT claim was set during user creation
2. The claim is always up-to-date
3. The role won't change after creation

Since roles may be updated by admins through the Supabase dashboard, we need to read the actual `role` column. The SECURITY DEFINER approach allows this safely.

## Files Modified
- `supabase-schema.sql` - Updated RLS policies and added helper function

## Related Issues
- Previous note: [STORAGE_BUCKET_FIX.md](STORAGE_BUCKET_FIX.md)
- Database setup: [DATABASE_SETUP.md](DATABASE_SETUP.md)

## Support
If the error persists after applying this fix:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Restart Next.js dev server: `pnpm dev`
3. Check Supabase project logs for additional errors
4. Verify the policies are correctly applied in Supabase Dashboard
