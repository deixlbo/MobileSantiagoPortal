# 📝 Code Changes Guide: Admin vs Official Implementation

This file shows the exact code changes needed to implement the Admin vs Official distinction.

---

## 1. Update User Types (`lib/types.ts`)

### Add 'admin' to UserRole
```typescript
// BEFORE:
export type UserRole = 'resident' | 'official';

// AFTER:
export type UserRole = 'resident' | 'official' | 'admin';
```

### Add Official Interface
```typescript
// ADD THIS:
export interface Official {
  id: string;
  userId: string;
  position: string; // Captain, Secretary, Kagawad, etc.
  department?: string;
  permissions: OfficialPermission[];
  createdAt: Date;
}

export type OfficialPermission = 
  | 'view_announcements' 
  | 'post_announcements'
  | 'view_documents'
  | 'manage_blotter'
  | 'manage_residents'
  | 'manage_documents'
  | 'manage_projects'
  | 'view_reports'
  | 'all_admin'; // Super admin access

/**
 * Role Permissions Guide:
 * 
 * RESIDENT:
 * - View announcements
 * - Request documents
 * - View blotter entries
 * - View ordinances
 * 
 * OFFICIAL:
 * - Post announcements
 * - Manage blotter entries
 * - View resident requests
 * - Basic reporting
 * 
 * ADMIN:
 * - Full resident management (verify, reject, deactivate)
 * - Complete document request processing
 * - Official account management
 * - Document reminder system
 * - Activity logs
 * - Full reporting & analytics
 * - Security & access control
 * - System settings
 */
```

---

## 2. Update Admin Layout (`app/admin/layout.tsx`)

### Allow Both Official and Admin Roles

#### BEFORE:
```typescript
useEffect(() => {
  if (!loading && (!user || user.role !== 'official')) {
    router.push('/login');
  }
}, [user, loading, router]);

if (loading || !user || user.role !== 'official') {
  return <LoadingScreen />;
}
```

#### AFTER:
```typescript
useEffect(() => {
  if (!loading && (!user || (user.role !== 'official' && user.role !== 'admin'))) {
    router.push('/login');
  }
}, [user, loading, router]);

if (loading || !user || (user.role !== 'official' && user.role !== 'admin')) {
  return <LoadingScreen />;
}
```

---

## 3. Update Admin Dashboard (`app/admin/dashboard/page.tsx`)

### Add Role Check at Start
```typescript
const { user } = useAuth();
const isAdmin = user?.role === 'admin';

// Later in useEffect:
useEffect(() => {
  if (!user || (user.role !== 'official' && user.role !== 'admin')) {
    router.push('/login');
    return;
  }
  // ... load data
}, [user, router]);
```

### Update Header Based on Role
```typescript
// BEFORE:
<div className="flex items-center gap-3">
  <div className="w-10 h-10 rounded-full bg-sidebar text-sidebar-foreground flex items-center justify-center font-bold">
    A
  </div>
  <div>
    <p className="font-semibold text-foreground">Admin Panel</p>
    <p className="text-xs text-muted-foreground">Barangay Santiago Management</p>
  </div>
</div>

// AFTER:
<div className="flex items-center gap-3">
  <div className="w-10 h-10 rounded-full bg-sidebar text-sidebar-foreground flex items-center justify-center font-bold">
    {user?.role === 'admin' ? 'A' : 'O'}
  </div>
  <div>
    <p className="font-semibold text-foreground">
      {user?.role === 'admin' ? 'Super Admin Panel' : 'Official Portal'}
    </p>
    <p className="text-xs text-muted-foreground">
      {user?.role === 'admin' ? 'Full System Management' : 'Barangay Official Functions'}
    </p>
  </div>
</div>
```

### Show Different Features Based on Role
```typescript
// In the management section:
<div className="space-y-3">
  {/* Available to both Admin and Official */}
  <Link href="/admin/announcements">
    <Button className="w-full justify-start gap-2" variant="outline">
      <Bell className="w-4 h-4" />
      Post Announcement
    </Button>
  </Link>
  
  <Link href="/admin/blotter">
    <Button className="w-full justify-start gap-2" variant="outline">
      <AlertTriangle className="w-4 h-4" />
      Incident Reports
    </Button>
  </Link>

  {/* Admin Only */}
  {user?.role === 'admin' && (
    <>
      <Link href="/admin/residents">
        <Button className="w-full justify-start gap-2" variant="outline">
          <Users className="w-4 h-4" />
          Manage Residents
        </Button>
      </Link>
      
      <Link href="/admin/documents">
        <Button className="w-full justify-start gap-2" variant="outline">
          <FileText className="w-4 h-4" />
          Document Requests
        </Button>
      </Link>
    </>
  )}
</div>
```

### Show Advanced Admin Features Only for Admin
```typescript
{user?.role === 'admin' && (
  <Card className="p-6 mt-6">
    <h3 className="font-semibold text-foreground mb-4">Advanced Admin Features</h3>
    <div className="space-y-3">
      {/* Projects, Business, Assets, Reports, Security, Settings */}
    </div>
  </Card>
)}
```

---

## 4. Protect Admin-Only Pages

### Example: `/app/admin/residents/page.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';

export default function ResidentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const isAdmin = user?.role === 'admin';

  // Show lock screen for non-admins
  if (!isAdmin) {
    return (
      <div className="p-8 text-center">
        <Card className="max-w-md mx-auto p-8">
          <Lock className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Admin Only</h2>
          <p className="text-muted-foreground mb-6">
            Full resident management (verify, approve, reject) is only available to Super Admins.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Your role: <span className="font-semibold text-foreground">{user?.role?.toUpperCase()}</span>
          </p>
          <Button onClick={() => router.push('/admin/dashboard')} variant="outline">
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  // Rest of admin page...
  return (
    // Full resident management UI
  );
}
```

### Apply Same Pattern To:
- `/app/admin/documents/page.tsx`
- `/app/admin/projects/page.tsx`
- `/app/admin/businesses/page.tsx`
- `/app/admin/assets/page.tsx`

---

## 5. Database Schema (Supabase/PostgreSQL)

### Add Role Column to Users Table
```sql
-- If using Supabase Auth, add to public.users table
ALTER TABLE public.users ADD COLUMN role TEXT DEFAULT 'resident';

-- Constraint
ALTER TABLE public.users ADD CONSTRAINT user_role_check 
CHECK (role IN ('resident', 'official', 'admin'));
```

### Create Officials Table
```sql
CREATE TABLE public.officials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  position VARCHAR(100) NOT NULL, -- Captain, Secretary, etc.
  department VARCHAR(100),
  permissions TEXT[] DEFAULT ARRAY[]::TEXT[], -- JSON array of permissions
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_officials_user_id ON public.officials(user_id);
```

### Create RLS Policies
```sql
-- Allow users to see their own role
CREATE POLICY "Users can view their own role"
ON public.users FOR SELECT
USING (auth.uid() = id);

-- Only admins can view/modify residents
CREATE POLICY "Only admins can view residents"
ON public.residents FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Only admins can modify documents
CREATE POLICY "Only admins can approve documents"
ON public.documents FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

---

## 6. Setting Roles in Database

### Create Admin User
```sql
-- After creating user in Supabase Auth, set role:
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'admin@brgy.gov.ph';
```

### Create Official User
```sql
-- Create official account
UPDATE public.users 
SET role = 'official' 
WHERE email = 'captain@brgy.gov.ph';

-- Optionally create official record
INSERT INTO public.officials (user_id, position, department)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'captain@brgy.gov.ph'),
  'Barangay Captain',
  'Executive'
);
```

---

## 7. Update Sidebar Component (if needed)

```typescript
// In Sidebar component
interface SidebarProps {
  userRole?: 'official' | 'admin';
}

export default function Sidebar({ userRole = 'official' }: SidebarProps) {
  const showFullMenu = userRole === 'admin';

  return (
    <aside>
      {/* Common items for both */}
      <NavItem href="/admin/announcements" icon={Bell}>
        Announcements
      </NavItem>
      
      <NavItem href="/admin/blotter" icon={AlertTriangle}>
        Blotter
      </NavItem>

      {/* Admin-only items */}
      {showFullMenu && (
        <>
          <NavItem href="/admin/residents" icon={Users}>
            Residents
          </NavItem>
          
          <NavItem href="/admin/documents" icon={FileText}>
            Documents
          </NavItem>
          
          {/* ... more admin items ... */}
        </>
      )}
    </aside>
  );
}
```

---

## Summary of File Changes

| File | Change | Purpose |
|------|--------|---------|
| `lib/types.ts` | Add 'admin' role & Official interface | Define role types |
| `app/admin/layout.tsx` | Allow both 'official' and 'admin' | Protect routes for both |
| `app/admin/dashboard/page.tsx` | Show different UI by role | Adapt dashboard |
| `app/admin/residents/page.tsx` | Add `isAdmin` check | Lock for officials |
| `app/admin/documents/page.tsx` | Add `isAdmin` check | Lock for officials |
| `app/admin/projects/page.tsx` | Add `isAdmin` check | Lock for officials |
| (database) | Add role column & officials table | Store role in DB |

---

## Testing the Changes

```typescript
// Test 1: Login as Official
// Expected: See limited dashboard with announcements & blotter only

// Test 2: Login as Admin
// Expected: See full dashboard with all features

// Test 3: Navigate to /admin/residents as Official
// Expected: See "Admin Only" lock screen

// Test 4: Navigate to /admin/residents as Admin
// Expected: See full resident management page
```

---

## Next Steps

1. ✅ Update `lib/types.ts` with new role
2. ✅ Update `app/admin/layout.tsx` to allow both roles
3. ✅ Update `app/admin/dashboard/page.tsx` with conditional UI
4. ✅ Add role checks to admin-only pages
5. ⏳ Create database schema with role column
6. ⏳ Set RLS policies in Supabase
7. ⏳ Assign roles to test users
8. ⏳ Test the complete flow
