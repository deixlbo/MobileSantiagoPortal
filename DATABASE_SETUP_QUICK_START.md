# DATABASE SETUP - QUICK START (5 MINUTES)

## The Issue
Your Supabase database has no tables. The application needs 10 tables to function.

## The Solution
Follow these 3 steps:

---

## STEP 1: Create Tables (2 minutes)

1. Open your Supabase project: https://supabase.com/dashboard
2. Go to **SQL Editor** (left sidebar)
3. Click **"New Query"**
4. Copy ALL content from this file: `/sql/schema.sql` (in your repo)
5. Paste it into the SQL editor
6. Click the blue **"Run"** button
7. Wait for "Success" message

**What this does:**
- Creates 10 tables (profiles, documents, notifications, etc.)
- Sets up relationships and constraints
- Enables security policies
- Creates automatic timestamp management

---

## STEP 2: Create Storage Buckets (2 minutes)

### Bucket 1: resident-uploads
1. Go to **Storage** (left sidebar in Supabase)
2. Click **"Create a new bucket"**
3. Enter name: `resident-uploads`
4. **UNCHECK** "Public bucket" ← Important!
5. Click **"Create bucket"**

### Bucket 2: announcements
1. Click **"Create a new bucket"** again
2. Enter name: `announcements`
3. **UNCHECK** "Public bucket" ← Important!
4. Click **"Create bucket"**

**What this does:**
- Creates private file storage
- Used for resident IDs, documents, announcements

---

## STEP 3: Verify Setup (1 minute)

Run this command in your terminal:

```bash
npx tsx scripts/verify-database.ts
```

You should see:
```
✓ Database connection successful
✓ All required tables exist!
✓ All table structures verified
✓ RLS policies configured
✓ Storage buckets verified
✅ Database verification complete!
```

---

## If Something Goes Wrong

### "No tables found" in Supabase
- Copy `/sql/schema.sql` again
- Make sure you clicked the blue "Run" button
- Check for any SQL error messages
- Try refreshing the page

### Tables already exist
- Delete them first (copy/paste this in SQL editor):
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
- Then run schema.sql again

### Buckets not showing
- Refresh the Supabase page
- Make sure they're set to PRIVATE (not public)
- Names must be lowercase with hyphens (no spaces)

---

## What Was Created

| Table | Purpose | Rows |
|-------|---------|------|
| profiles | Admin & resident users | 0 |
| document_requests | Document requests | 0 |
| notifications | User notifications | 0 |
| audit_logs | Activity tracking | 0 |
| complaints | Blotter/complaints | 0 |
| announcements | Admin announcements | 0 |
| households | Household groups | 0 |
| household_members | Household members | 0 |
| file_uploads | Upload metadata | 0 |
| payments | Payment tracking | 0 |

| Bucket | Purpose |
|--------|---------|
| resident-uploads | ID photos, documents |
| announcements | Announcement images |

---

## Next: Test It

1. Create a test admin user
2. Create a test resident user
3. Try logging in
4. Try uploading a file
5. Try requesting a document
6. Check if notifications appear

---

## Complete Documentation

For more details, see:
- `SUPABASE_SETUP_GUIDE.md` - Full step-by-step guide
- `sql/schema.sql` - Raw SQL code
- `scripts/verify-database.ts` - Verification script

---

## Summary

✓ 10 tables created
✓ Foreign key relationships set up
✓ Row Level Security configured
✓ Storage buckets created
✓ Ready to use!

Time to complete: 5 minutes
Status: Ready for testing
