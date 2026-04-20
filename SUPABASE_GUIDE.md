# 🚀 Supabase Integration Guide

This guide covers how to use Supabase in the Barangay Santiago Portal with all common CRUD operations.

## Environment Variables

Make sure these are set in your `.env` file:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Schema

### Tables Available
- **users** - User accounts (admin, official, resident)
- **announcements** - Barangay announcements
- **documents** - Document requests
- **blotter** - Incident reports
- **projects** - Barangay projects
- **businesses** - Business registrations
- **ordinances** - Barangay ordinances
- **admin_settings** - Configuration settings

## Quick Start

### Method 1: Using the Hook (Recommended for React Components)

```tsx
import { useSupabase } from '@/lib/use-supabase';

export function MyComponent() {
  const { data, loading, error, readAll, create, update, delete: deleteItem } = useSupabase('announcements');

  // Read all announcements
  useEffect(() => {
    readAll();
  }, [readAll]);

  // Create new announcement
  const handleCreate = async () => {
    const result = await create({
      title: 'New Announcement',
      description: 'This is a test',
      posted_by: 'user-id-here',
    });
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
```

### Method 2: Using Direct Client Functions

```tsx
import { selectAll, insert, updateById, deleteById, search } from '@/lib/supabase-client';

// Read all
const { data: announcements, error } = await selectAll('announcements');

// Create
const { data: newAnnouncement } = await insert('announcements', {
  title: 'Meeting Notice',
  description: 'Monthly council meeting',
  posted_by: 'user-123',
});

// Update
const { data: updated } = await updateById('announcements', 'id-123', {
  title: 'Updated Title',
});

// Delete
await deleteById('announcements', 'id-123');

// Search
const { data: results } = await search('announcements', 'title', 'meeting');
```

## Common Operations

### CREATE - Insert a Record

```tsx
// Single record
const { data, error } = await insert('users', {
  email: 'resident@example.com',
  full_name: 'Juan Dela Cruz',
  user_type: 'resident',
  status: 'active',
  is_activated: true,
});

// Multiple records
const { data, error } = await insertMany('announcements', [
  { title: 'Announcement 1', description: '...', posted_by: 'id-1' },
  { title: 'Announcement 2', description: '...', posted_by: 'id-2' },
]);
```

### READ - Query Records

```tsx
// Get all records
const { data } = await selectAll('users');

// Get by ID
const { data: user } = await selectById('users', 'uuid-123');

// Get with filter (equality)
const { data: residents } = await selectWhere('users', 'user_type', 'resident');

// Get with multiple filters
const { data: docs } = await selectWhereMultiple('documents', [
  { column: 'status', value: 'pending' },
  { column: 'resident_id', value: 'uuid-123' },
]);

// Search (LIKE operator)
const { data: results } = await search('users', 'full_name', 'Juan');

// Get sorted (ascending/descending)
const { data: recent } = await selectSorted('announcements', 'created_at', { 
  ascending: false,
  limit: 10 
});

// Get paginated
const { data: page1, count } = await selectPaginated('users', 0, 20); // page 0, 20 per page
```

### UPDATE - Modify Records

```tsx
// Update by ID
const { data: updated } = await updateById('users', 'uuid-123', {
  full_name: 'New Name',
  phone: '0912-345-6789',
});

// Update multiple records by filter
const { data: updated } = await updateWhere('documents', 'status', 'pending', {
  status: 'approved',
});
```

### DELETE - Remove Records

```tsx
// Delete by ID
await deleteById('users', 'uuid-123');

// Delete multiple by filter
await deleteWhere('announcements', 'posted_by', 'uuid-123');
```

### COUNT - Get Record Counts

```tsx
// Count all records
const { count } = await countRecords('users');

// Count with filter
const { count } = await countWhere('users', 'user_type', 'resident');
```

### SEARCH - Find Records

```tsx
// Using LIKE for pattern matching
const { data: results } = await search('users', 'full_name', 'Maria');
// Finds: "Maria Santos", "Marie Johnson", etc.

// Using comparison operators
const { data: serious } = await selectWithComparison(
  'blotter',
  'severity',
  'high',
  'eq'
);

const { data: recent } = await selectWithComparison(
  'documents',
  'created_at',
  '2024-04-01',
  'gte' // greater than or equal
);
```

## Comparison Operators

When using `selectWithComparison`, available operators are:

| Operator | Usage | Example |
|----------|-------|---------|
| `eq` | Equal to | `{ column: 'status', value: 'active', operator: 'eq' }` |
| `gt` | Greater than | `{ column: 'age', value: 18, operator: 'gt' }` |
| `lt` | Less than | `{ column: 'age', value: 65, operator: 'lt' }` |
| `gte` | Greater than or equal | `{ column: 'created_at', value: '2024-01-01', operator: 'gte' }` |
| `lte` | Less than or equal | `{ column: 'created_at', value: '2024-12-31', operator: 'lte' }` |
| `like` | Pattern match | `{ column: 'name', value: 'John', operator: 'like' }` |

## Admin Dashboard

### Direct Access (No Login Required)
- Navigate directly to: `/admin/dashboard`
- No authentication required to view
- Manage pending user approvals
- View all users and their status

### From Landing Page
Click the "Admin Dashboard" button in the navigation to access directly.

## Usage Examples

### Example 1: Load and Display Announcements

```tsx
import { useSupabase } from '@/lib/use-supabase';
import { useEffect } from 'react';

export function AnnouncementsList() {
  const { data: announcements, loading, error, readAll } = useSupabase('announcements');

  useEffect(() => {
    readAll();
  }, [readAll]);

  if (loading) return <div>Loading announcements...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {announcements?.map((announcement) => (
        <div key={announcement.id}>
          <h3>{announcement.title}</h3>
          <p>{announcement.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Create and Update Document Request

```tsx
import { useSupabase } from '@/lib/use-supabase';

export function DocumentRequest() {
  const { create, update } = useSupabase('documents');

  const handleRequestClearance = async (residentId: string) => {
    // Create new request
    const doc = await create({
      resident_id: residentId,
      document_type: 'Clearance',
      status: 'pending',
      requested_at: new Date(),
    });

    // Later, update when approved
    if (doc) {
      await update(doc.id, {
        status: 'approved',
        processed_at: new Date(),
        notes: 'Approved by Secretary',
      });
    }
  };

  return <button onClick={() => handleRequestClearance('user-id')}>Request Clearance</button>;
}
```

### Example 3: Search Residents

```tsx
import { search } from '@/lib/supabase-client';
import { useState } from 'react';

export function ResidentSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (searchTerm: string) => {
    const { data, error } = await search('users', 'full_name', searchTerm);
    if (!error) setResults(data);
  };

  return (
    <div>
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          handleSearch(e.target.value);
        }}
        placeholder="Search residents..."
      />
      {results.map((resident) => (
        <div key={resident.id}>{resident.full_name}</div>
      ))}
    </div>
  );
}
```

### Example 4: Filter Documents by Status

```tsx
import { selectWhere, updateWhere } from '@/lib/supabase-client';

export async function approvePendingDocuments() {
  // Get all pending documents
  const { data: pending } = await selectWhere('documents', 'status', 'pending');

  // Approve first 5
  const toApprove = pending?.slice(0, 5) || [];
  
  for (const doc of toApprove) {
    await updateById('documents', doc.id, { status: 'approved' });
  }
}
```

## Error Handling

All functions return `{ data, error }`. Always check for errors:

```tsx
const { data, error } = await selectAll('users');

if (error) {
  console.error('Failed to fetch users:', error.message);
  // Handle error appropriately
} else {
  console.log('Users loaded:', data);
}
```

## Performance Tips

1. **Use pagination for large tables**
   ```tsx
   const { data, count } = await selectPaginated('users', 0, 20);
   ```

2. **Limit results**
   ```tsx
   const { data } = await selectSorted('announcements', 'created_at', { limit: 10 });
   ```

3. **Use hooks for reactive updates**
   ```tsx
   const { data, readAll } = useSupabase('announcements');
   useEffect(() => { readAll(); }, [readAll]);
   ```

4. **Filter early to reduce data transfer**
   ```tsx
   // Good - filter in query
   const { data } = await selectWhere('users', 'status', 'active');
   
   // Avoid - filter in code
   const { data } = await selectAll('users'); // then filter manually
   ```

## Running Database Migrations

To initialize the database schema:

```bash
cd scripts
node run-migrations.js
```

This creates all tables and applies seed data with sample credentials.

## Sample Credentials (After Migration)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@santiago.gov.ph | password123 |
| Resident | juan.dela.cruz@email.com | password123 |
| Resident | maria.santos@email.com | password123 |
| Official | mayor@santiago.gov.ph | password123 |
| Official | secretary@santiago.gov.ph | password123 |

## Getting Help

For Supabase documentation: https://supabase.com/docs
For this project's Supabase utilities: Check `/src/lib/supabase-client.ts` and `/src/lib/use-supabase.ts`
