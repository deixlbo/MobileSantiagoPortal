# 🏗️ Supabase Integration Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    REACT COMPONENTS                          │
│  (Landing, Admin Dashboard, Resident Dashboard, etc.)       │
└──────────┬──────────────────────────────────────────────────┘
           │
           ├─────────────────────────────────────┐
           │                                     │
           v                                     v
   ┌───────────────────┐             ┌──────────────────┐
   │  useSupabase Hook │             │  Direct Functions│
   │ (React Component) │             │  (API Routes)    │
   └────────┬──────────┘             └────────┬─────────┘
            │                                 │
            └─────────────┬───────────────────┘
                          │
                          v
        ┌─────────────────────────────────────┐
        │   Supabase Client Library           │
        │  (/lib/supabase-client.ts)          │
        │                                     │
        │  - insert()           CREATE        │
        │  - selectAll()        READ          │
        │  - updateById()       UPDATE        │
        │  - deleteById()       DELETE        │
        │  - search()           FILTER        │
        │  - selectSorted()     SORT          │
        │  - selectPaginated()  LIMIT         │
        └────────────┬──────────────────────┘
                     │
                     v
        ┌─────────────────────────────────┐
        │    Supabase JavaScript SDK      │
        │  (@supabase/supabase-js)        │
        └────────────┬────────────────────┘
                     │
                     v
        ┌─────────────────────────────────┐
        │    Supabase Backend API         │
        │     (PostgreSQL Database)       │
        │                                 │
        │  Tables:                        │
        │  - users                        │
        │  - announcements                │
        │  - documents                    │
        │  - blotter                      │
        │  - projects                     │
        │  - businesses                   │
        │  - ordinances                   │
        │  - admin_settings               │
        └─────────────────────────────────┘
```

## Admin Dashboard Direct Access Flow

```
USER VISITS WEBSITE
        │
        ├─→ Landing Page (/
        │   │
        │   └─→ Click "Admin Dashboard" Button
        │       │
        │       └─→ Navigate to /admin/dashboard
        │           │
        │           └─→ NO AUTH CHECK ✓
        │               │
        │               └─→ Admin Dashboard Loads
        │                   │
        │                   ├─→ Load Pending Users
        │                   ├─→ Load All Users
        │                   └─→ Show Management UI
        │
        └─→ Direct URL: /admin/dashboard
            │
            └─→ NO LOGIN REQUIRED ✓
                │
                └─→ Admin Dashboard Loads
```

## React Component to Database Flow

```
Component Mounts
    │
    ├─→ import { useSupabase } from '@/lib/use-supabase'
    │
    ├─→ const { data, loading, error, readAll } = useSupabase('announcements')
    │
    ├─→ useEffect(() => {
    │     readAll() // Fetch all announcements
    │   }, [readAll])
    │
    └─→ 1. useSupabase calls supabaseClient.selectAll()
           │
           2. selectAll() creates Supabase query
           │
           3. Query sent to Supabase backend
           │
           4. PostgreSQL database returns results
           │
           5. Results received in React component
           │
           6. Component state updates (data, loading, error)
           │
           7. Component re-renders with data
```

## CRUD Operations Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    CREATE (INSERT)                           │
├─────────────────────────────────────────────────────────────┤
│  insert(table, { field: 'value' })                          │
│    │                                                         │
│    └─→ supabase.from(table).insert([data]).select()        │
│        │                                                     │
│        └─→ INSERT INTO table VALUES (...)                  │
│            │                                                 │
│            └─→ Returns: { id, created_at, ... }            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    READ (SELECT)                             │
├─────────────────────────────────────────────────────────────┤
│  selectAll(table)                                            │
│    │                                                         │
│    └─→ supabase.from(table).select('*')                    │
│        │                                                     │
│        └─→ SELECT * FROM table                             │
│            │                                                 │
│            └─→ Returns: [{ ... }, { ... }, ...]           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    UPDATE                                    │
├─────────────────────────────────────────────────────────────┤
│  updateById(table, id, { field: 'newValue' })              │
│    │                                                         │
│    └─→ supabase.from(table).update({...}).eq('id', id)    │
│        │                                                     │
│        └─→ UPDATE table SET ... WHERE id = ?               │
│            │                                                 │
│            └─→ Returns: { updated_at, ... }                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    DELETE                                    │
├─────────────────────────────────────────────────────────────┤
│  deleteById(table, id)                                       │
│    │                                                         │
│    └─→ supabase.from(table).delete().eq('id', id)         │
│        │                                                     │
│        └─→ DELETE FROM table WHERE id = ?                  │
│            │                                                 │
│            └─→ Returns: success status                      │
└─────────────────────────────────────────────────────────────┘
```

## Filtering & Operators

```
selectWithComparison(table, column, value, operator)
    │
    ├─→ operator: 'eq'   → column = value
    │
    ├─→ operator: 'gt'   → column > value
    │
    ├─→ operator: 'lt'   → column < value
    │
    ├─→ operator: 'gte'  → column >= value
    │
    ├─→ operator: 'lte'  → column <= value
    │
    └─→ operator: 'like' → column LIKE %value%
```

## Hook State Management

```
useSupabase(table)
    │
    ├─→ Returns: {
    │     data: T[] | T | null,              // Fetched data
    │     loading: boolean,                   // Loading state
    │     error: string | null,               // Error message
    │
    │     // Operations
    │     create: (record) => Promise,        // Create one
    │     createMany: (records) => Promise,   // Create many
    │     readAll: () => Promise,             // Read all
    │     readById: (id) => Promise,          // Read by ID
    │     readWhere: (col, val) => Promise,   // Read with filter
    │     search: (col, term) => Promise,     // Search (LIKE)
    │     update: (id, updates) => Promise,   // Update
    │     delete: (id) => Promise             // Delete
    │   }
    │
    └─→ All operations automatically:
         - Set loading = true
         - Clear previous error
         - Update data on success
         - Set error on failure
         - Set loading = false
```

## Database Schema Relationships

```
┌──────────────────────────────────────────────────────────┐
│                         USERS                             │
│  id (PK) │ email │ full_name │ user_type │ status │ ...  │
└─────────┬────────────────────────────────────────────────┘
          │
          ├─────────────────────────────────────────────┐
          │                                             │
          v                                             v
    ┌──────────────────┐                     ┌──────────────────┐
    │  ANNOUNCEMENTS   │                     │    DOCUMENTS     │
    │ id │ posted_by ↑ │                     │ id │ resident_id ↑│
    │    │ (FK: users) │                     │    │ (FK: users)  │
    └──────────────────┘                     └──────────────────┘
          ↑                                             ↑
          │                                             │
          v                                             v
    ┌──────────────────┐                     ┌──────────────────┐
    │    BLOTTER       │                     │    PROJECTS      │
    │ id │ reporter_id ↑│                     │ id │ created_by ↑│
    │    │ (FK: users) │                     │    │ (FK: users) │
    └──────────────────┘                     └──────────────────┘
          ↑                                             ↑
          │                                             │
          v                                             v
    ┌──────────────────┐                     ┌──────────────────┐
    │   BUSINESSES     │                     │  ORDINANCES      │
    │ id │ owner_id ↑  │                     │ id │ ...         │
    │    │ (FK: users) │                     │    │             │
    └──────────────────┘                     └──────────────────┘
```

## Authentication & Admin Access

```
┌─────────────────────────────────────────────┐
│         Protected Routes                    │
├─────────────────────────────────────────────┤
│ /resident/dashboard        → Requires auth  │
│ /official/dashboard        → Requires auth  │
│ /login/*                   → Public         │
│ /register                  → Public         │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│         Admin Dashboard                     │
├─────────────────────────────────────────────┤
│ /admin/dashboard           → NO AUTH ✓      │
│                                             │
│ Anyone can access!                          │
│ No login form required                      │
│ Direct navigation from landing page         │
└─────────────────────────────────────────────┘
```

## File Organization

```
/vercel/share/v0-project/
│
├── SUPABASE_GUIDE.md                    ← Full documentation
├── SUPABASE_QUICK_REFERENCE.md         ← Cheat sheet
├── SUPABASE_SETUP_COMPLETE.md          ← Setup guide
├── README_SUPABASE.md                  ← This file summary
├── ARCHITECTURE.md                     ← This file
│
├── scripts/
│   ├── 01-init-database.sql            ← Database schema
│   └── run-migrations.js               ← Migration runner
│
└── artifacts/barangay-portal/
    └── src/
        ├── lib/
        │   ├── supabase-client.ts      ← CRUD utilities
        │   └── use-supabase.ts         ← React hook
        │
        ├── pages/
        │   ├── landing.tsx             ← Updated with admin link
        │   └── admin/
        │       └── dashboard.tsx       ← Direct access (no auth)
        │
        └── components/examples/
            └── announcements-example.tsx  ← Working example
```

## Import Paths

```typescript
// React Hook (recommended for components)
import { useSupabase } from '@/lib/use-supabase';

// Direct Functions (for API routes, utilities)
import { 
  insert, 
  selectAll, 
  updateById, 
  deleteById,
  search,
  selectWithComparison,
  selectSorted,
  selectPaginated
} from '@/lib/supabase-client';

// Supabase client (advanced)
import { supabase } from '@/lib/supabase-client';
```

---

**This architecture provides a clean, scalable, and type-safe way to interact with Supabase throughout your application!**
