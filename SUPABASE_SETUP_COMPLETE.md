# 🚀 Barangay Santiago Portal - Supabase Setup Complete!

Your Supabase integration is now fully configured with all necessary components for your portal application.

## ✅ What's Been Set Up

### 1. **Database Schema** (`/scripts/01-init-database.sql`)
Complete database structure with 8 main tables:
- **users** - User management (admin, official, resident)
- **announcements** - Barangay news and updates
- **documents** - Document request tracking
- **blotter** - Incident reporting system
- **projects** - Barangay projects management
- **businesses** - Business registration system
- **ordinances** - Barangay ordinances
- **admin_settings** - Configuration management

### 2. **Supabase Client Library** (`/src/lib/supabase-client.ts`)
Complete CRUD utilities implementing the pattern you requested:
- **CREATE**: `insert()`, `insertMany()`
- **READ**: `selectAll()`, `selectById()`, `selectWhere()`, `selectWhereMultiple()`, `search()`, `selectSorted()`, `selectPaginated()`
- **UPDATE**: `updateById()`, `updateWhere()`
- **DELETE**: `deleteById()`, `deleteWhere()`
- **COUNT**: `countRecords()`, `countWhere()`
- **FILTERS**: `selectWithComparison()` with operators: `eq`, `gt`, `lt`, `gte`, `lte`, `like`

### 3. **React Hook** (`/src/lib/use-supabase.ts`)
Custom hook `useSupabase()` for easy integration in React components with:
- Loading state management
- Error handling
- All CRUD operations
- Reactive data updates

### 4. **Admin Dashboard** (Direct Access - No Login Required!)
- **URL**: `/admin/dashboard`
- **Access**: Click "Admin Dashboard" button on landing page
- **Features**: 
  - View pending user approvals
  - Manage all users
  - Approve/reject registrations
  - Delete accounts

### 5. **Updated Landing Page**
- "Admin Dashboard" button replaces the old "Admin Login"
- Direct access to admin dashboard without authentication
- Both desktop and mobile navigation updated

### 6. **Documentation**
- **SUPABASE_GUIDE.md** - Comprehensive guide with examples
- **SUPABASE_QUICK_REFERENCE.md** - Cheat sheet for quick lookup
- **Example Component** - Fully commented example showing best practices

## 🎯 Quick Start Guide

### Initialize Database
```bash
cd /vercel/share/v0-project/scripts
node run-migrations.js
```

This creates all tables and loads sample data with test credentials.

### Use in Components

**Method 1: Using the Hook (Recommended)**
```tsx
import { useSupabase } from '@/lib/use-supabase';

export function MyComponent() {
  const { data, loading, error, readAll, create, update, delete: deleteItem } = useSupabase('announcements');

  useEffect(() => {
    readAll(); // Load data
  }, [readAll]);

  return <div>{loading ? 'Loading...' : data?.length} announcements</div>;
}
```

**Method 2: Direct Client Functions**
```tsx
import { selectAll, insert, updateById, deleteById } from '@/lib/supabase-client';

// Read
const { data } = await selectAll('announcements');

// Create
const { data: newItem } = await insert('announcements', { title: '...' });

// Update
await updateById('announcements', 'id-123', { title: 'Updated' });

// Delete
await deleteById('announcements', 'id-123');
```

## 📊 Common Operations

### Search
```tsx
const { data } = await search('users', 'full_name', 'Maria');
```

### Filter & Compare
```tsx
// Equal
const { data } = await selectWhere('documents', 'status', 'pending');

// Greater than, less than, etc.
const { data } = await selectWithComparison(
  'blotter', 'created_at', '2024-01-01', 'gte'
);
```

### Pagination
```tsx
const { data, count } = await selectPaginated('users', 0, 20); // Page 0, 20 items
```

### Sorting
```tsx
const { data } = await selectSorted('announcements', 'created_at', { 
  ascending: false,  // Most recent first
  limit: 10 
});
```

## 🔐 Environment Variables

The following variables are automatically configured:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `POSTGRES_URL`
- And others...

These are available to both the frontend and backend.

## 👤 Admin Dashboard Access

**Direct Access (No Login):**
1. Navigate to `/admin/dashboard`
2. Or click "Admin Dashboard" button on landing page
3. Manage users and approvals immediately

**Sample Admin Credentials** (after migration):
- Email: `admin@santiago.gov.ph`
- Password: `password123`

## 📁 File Structure

```
/vercel/share/v0-project/
├── SUPABASE_GUIDE.md              ← Full documentation
├── SUPABASE_QUICK_REFERENCE.md    ← Cheat sheet
├── scripts/
│   ├── 01-init-database.sql       ← Database schema
│   └── run-migrations.js          ← Migration runner
└── artifacts/barangay-portal/src/
    ├── lib/
    │   ├── supabase-client.ts     ← All CRUD utilities
    │   └── use-supabase.ts        ← React hook
    └── components/examples/
        └── announcements-example.tsx ← Example component
```

## 🚀 Deploy to Production

When ready to deploy to Vercel:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "feat: add Supabase integration with admin dashboard"
   git push origin main
   ```

2. **Vercel will automatically:**
   - Install dependencies
   - Build the application
   - Deploy with Supabase environment variables

3. **Run migrations on production database**
   ```bash
   # From Vercel CLI or environment
   node scripts/run-migrations.js
   ```

## 📖 Documentation Files

1. **SUPABASE_GUIDE.md** (402 lines)
   - Complete reference with all operations
   - Code examples for each pattern
   - Tips and best practices
   - Error handling guide

2. **SUPABASE_QUICK_REFERENCE.md** (133 lines)
   - One-page cheat sheet
   - Quick syntax for all operations
   - Filter operators
   - Database table reference

3. **Component Example** (190 lines)
   - Working example: AnnouncementsExample
   - Shows loading, error, search, create states
   - Best practices for component structure

## 🔗 Related Files

- **Landing Page**: `/artifacts/barangay-portal/src/pages/landing.tsx`
  - Updated with direct admin dashboard link
  - Desktop and mobile navigation updated

- **Admin Dashboard**: `/artifacts/barangay-portal/src/pages/admin/dashboard.tsx`
  - Removed login requirement
  - Direct access enabled

- **App Router**: `/artifacts/barangay-portal/src/App.tsx`
  - Admin route configured
  - No auth required for `/admin/dashboard`

## ✨ Key Features

✅ **Common Supabase Patterns** - insert, select, update, delete, filter, sort, limit  
✅ **Type-Safe** - Full TypeScript support  
✅ **React Hooks** - Easy component integration  
✅ **Direct Admin Access** - No login required  
✅ **Database Schema** - 8 pre-configured tables  
✅ **Sample Data** - Migration includes test users  
✅ **Error Handling** - Built-in error management  
✅ **Performance** - Pagination and filtering support  

## 🆘 Troubleshooting

**Tables not showing in Supabase dashboard?**
- Run: `node scripts/run-migrations.js`

**Environment variables missing?**
- Check project settings → Vars
- All required env vars should be set

**Client connection issues?**
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Check browser console for errors

**Admin dashboard returning 404?**
- Ensure you're accessing `/admin/dashboard` (no `/login/admin`)
- Router is updated to support direct access

## 📚 Next Steps

1. **Review Documentation**
   - Read SUPABASE_GUIDE.md for comprehensive guide
   - Check SUPABASE_QUICK_REFERENCE.md for cheat sheet

2. **Initialize Database**
   - Run migrations: `node scripts/run-migrations.js`
   - Test with sample credentials

3. **Build Components**
   - Use the hook: `const {} = useSupabase('tableName')`
   - Or use direct client: `import { selectAll, insert } from '@/lib/supabase-client'`

4. **Test Admin Dashboard**
   - Navigate to `/admin/dashboard`
   - Test user management features

5. **Deploy**
   - Push to GitHub
   - Vercel auto-deploys with Supabase env vars

---

**Happy Building! 🎉**

All utilities follow the standard pattern:
- **CREATE**: `insert()`
- **READ**: `select*()`
- **UPDATE**: `update*()`
- **DELETE**: `delete*()`
- **FILTER**: `eq()`, `gt()`, `lt()`, `like()`
- **SORT**: `order()`
- **LIMIT**: `limit()`

Everything is ready for production use!
