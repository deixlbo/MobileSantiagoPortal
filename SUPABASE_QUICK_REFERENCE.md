# 🚀 SUPABASE QUICK REFERENCE

## PATTERN CHEAT SHEET

### CREATE (Insert)
```tsx
// Single
const { data } = await insert('table', { field: 'value' });

// Multiple
const { data } = await insertMany('table', [
  { field: 'value1' },
  { field: 'value2' },
]);
```

### READ (Select)
```tsx
// All
const { data } = await selectAll('table');

// By ID
const { data } = await selectById('table', 'id');

// Where (filter)
const { data } = await selectWhere('table', 'column', 'value');

// Multiple filters
const { data } = await selectWhereMultiple('table', [
  { column: 'col1', value: 'val1' },
  { column: 'col2', value: 'val2' },
]);

// Search (LIKE)
const { data } = await search('table', 'column', 'term');

// Sorted
const { data } = await selectSorted('table', 'column', { 
  ascending: false, 
  limit: 10 
});

// Paginated
const { data, count } = await selectPaginated('table', page, 20);

// Comparison
const { data } = await selectWithComparison(
  'table', 'column', value, 'gt' // eq, gt, lt, gte, lte, like
);
```

### UPDATE
```tsx
// By ID
const { data } = await updateById('table', 'id', { field: 'newValue' });

// Where filter
const { data } = await updateWhere('table', 'column', 'value', { field: 'newValue' });
```

### DELETE
```tsx
// By ID
await deleteById('table', 'id');

// Where filter
await deleteWhere('table', 'column', 'value');
```

### COUNT
```tsx
// All
const { count } = await countRecords('table');

// Where filter
const { count } = await countWhere('table', 'column', 'value');
```

## REACT HOOK

```tsx
import { useSupabase } from '@/lib/use-supabase';

const { 
  data, 
  loading, 
  error,
  readAll,
  readById,
  readWhere,
  search,
  create,
  createMany,
  update,
  delete: deleteItem,
} = useSupabase('tableName');
```

## DATABASE TABLES

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| users | User accounts | id, email, full_name, user_type, status |
| announcements | News & alerts | id, title, description, posted_by |
| documents | Doc requests | id, resident_id, document_type, status |
| blotter | Incident reports | id, incident_type, severity, status |
| projects | Barangay projects | id, name, created_by, status |
| businesses | Business registrations | id, owner_id, business_name, status |
| ordinances | Barangay ordinances | id, ordinance_number, title |
| admin_settings | Configuration | id, setting_key, setting_value |

## FILTERS

| Operator | Example |
|----------|---------|
| `eq` | `selectWithComparison('table', 'col', 'val', 'eq')` |
| `gt` | `selectWithComparison('table', 'age', 18, 'gt')` |
| `lt` | `selectWithComparison('table', 'age', 65, 'lt')` |
| `gte` | `selectWithComparison('table', 'date', '2024-01-01', 'gte')` |
| `lte` | `selectWithComparison('table', 'date', '2024-12-31', 'lte')` |
| `like` | `search('table', 'name', 'John')` |

## ADMIN DASHBOARD

- **URL**: `/admin/dashboard`
- **Login**: None required (direct access)
- **Access**: Click "Admin Dashboard" button on landing page

---

**📚 Full Guide**: See SUPABASE_GUIDE.md
**📂 Utilities**: `/src/lib/supabase-client.ts`, `/src/lib/use-supabase.ts`
