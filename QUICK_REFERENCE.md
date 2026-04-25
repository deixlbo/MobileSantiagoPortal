# 🚀 Quick Reference: Admin vs Official

## TL;DR

You have **2 administrative roles** with different permissions:

| | **Official** | **Admin** |
|---|---|---|
| **Login** | `/login/official` | `/login/official` |
| **Dashboard** | Limited features | Full features |
| **Post Announcements** | ✅ | ✅ |
| **Manage Blotter** | ✅ | ✅ |
| **Manage Residents** | ❌ Locked | ✅ |
| **Process Documents** | ❌ Locked | ✅ |
| **System Admin** | ❌ | ✅ |

---

## User Types

### 1️⃣ RESIDENT
```
Role: 'resident'
Access: /user/*
Can: Request documents, view announcements, file blotter reports
Cannot: Manage anything
```

### 2️⃣ OFFICIAL
```
Role: 'official'
Access: /admin/* (limited)
Can: Post announcements, manage blotter
Cannot: Manage residents, process documents, access admin features
Example: Barangay Captain, Secretary
```

### 3️⃣ ADMIN (Super Admin)
```
Role: 'admin'
Access: /admin/* (full)
Can: Everything - manage residents, documents, officials, reports
Example: System Administrator
```

---

## Code Changes Made

### ✅ Files Modified:
- `lib/types.ts` - Added 'admin' role & Official interface
- `ROLES_PERMISSIONS.md` - Complete documentation
- `ADMIN_VS_OFFICIAL.md` - Comparison guide
- `CODE_CHANGES_GUIDE.md` - Implementation steps
- `IMPLEMENTATION_SUMMARY.md` - What was done

### ✅ Key Addition to Types:
```typescript
export type UserRole = 'resident' | 'official' | 'admin';

export interface Official {
  id: string;
  userId: string;
  position: string; // Captain, Secretary, Kagawad
  permissions: OfficialPermission[];
}
```

---

## Database Setup

### Set Role for User
```sql
-- Make admin
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';

-- Make official
UPDATE users SET role = 'official' WHERE email = 'official@example.com';

-- Make resident
UPDATE users SET role = 'resident' WHERE email = 'resident@example.com';
```

---

## How It Works in Code

### Check Role in Component
```typescript
const { user } = useAuth();
const isAdmin = user?.role === 'admin';

if (!isAdmin) {
  return <LockScreen />;
}
```

### Show Different UI
```typescript
{user?.role === 'admin' && <AdminFeatures />}
{user?.role === 'official' && <OfficialFeatures />}
```

---

## Protected Pages

| Page | Visible To | Locked For |
|------|-----------|-----------|
| `/admin/dashboard` | official, admin | resident |
| `/admin/announcements` | official, admin | resident |
| `/admin/blotter` | official, admin | resident |
| `/admin/residents` | admin only | official ⛔, resident |
| `/admin/documents` | admin only | official ⛔, resident |
| `/admin/projects` | admin only | official ⛔, resident |
| `/admin/businesses` | admin only | official ⛔, resident |
| `/admin/assets` | admin only | official ⛔, resident |

---

## Login Flow

```
User visits /login/official
  ↓
Creates account
  ↓
Auth system creates user
  ↓
Admin sets role in database:
  - 'official' → /admin (limited)
  - 'admin'    → /admin (full)
  ↓
User logs in with role-based interface
```

---

## Testing Checklist

- [ ] Create user with `role = 'official'` and login
- [ ] Verify they see announcements and blotter only
- [ ] Try accessing `/admin/residents` - should see lock screen
- [ ] Create user with `role = 'admin'` and login
- [ ] Verify they see full admin panel
- [ ] Try accessing `/admin/residents` - should see full page
- [ ] Verify dashboard header changes: "Official Portal" vs "Super Admin Panel"

---

## Files to Read

### Quick Overview (start here)
1. **This file** (`QUICK_REFERENCE.md`) - You are here
2. **`ADMIN_VS_OFFICIAL.md`** - Side-by-side comparison

### Complete Details
3. **`ROLES_PERMISSIONS.md`** - All features explained
4. **`CODE_CHANGES_GUIDE.md`** - Exact code to add
5. **`IMPLEMENTATION_SUMMARY.md`** - What was done

### Code Files
6. **`lib/types.ts`** - Type definitions
7. **`app/admin/layout.tsx`** - Role checks
8. **`app/admin/dashboard/page.tsx`** - Conditional UI

---

## Common Tasks

### Make Someone an Admin
```sql
UPDATE users SET role = 'admin' WHERE email = 'newadmin@brgy.gov.ph';
```

### Make Someone an Official
```sql
UPDATE users SET role = 'official' WHERE email = 'captain@brgy.gov.ph';
INSERT INTO officials (user_id, position)
VALUES ('user_id', 'Barangay Captain');
```

### Check User's Current Role
```sql
SELECT email, role FROM users WHERE email = 'test@example.com';
```

### Revert Admin to Official
```sql
UPDATE users SET role = 'official' WHERE email = 'person@brgy.gov.ph';
```

---

## Architecture

```
User Login
    ↓
Check user.role
    ├─ 'resident' → /user/*
    ├─ 'official' → /admin/* (limited UI)
    └─ 'admin' → /admin/* (full UI)
        ├─ /admin/dashboard (full)
        ├─ /admin/announcements (full)
        ├─ /admin/blotter (full)
        ├─ /admin/residents (admin only) ⛔
        ├─ /admin/documents (admin only) ⛔
        ├─ /admin/projects (admin only) ⛔
        └─ etc...
```

---

## Summary

```
BEFORE:
- Only 'official' role for admins
- No distinction between types of admins

AFTER:
- 'official' role for barangay officials (limited)
- 'admin' role for system administrators (full)
- Each role sees appropriate UI and has access to appropriate pages
- Admin-only pages show lock screen for officials
```

**Result**: Clean separation of concerns with proper access control!

---

## Need Help?

1. **Want to understand permissions?** → Read `ROLES_PERMISSIONS.md`
2. **Want to see code changes?** → Read `CODE_CHANGES_GUIDE.md`
3. **Want detailed comparison?** → Read `ADMIN_VS_OFFICIAL.md`
4. **Want implementation details?** → Read `IMPLEMENTATION_SUMMARY.md`
5. **Want the types?** → Check `lib/types.ts`
