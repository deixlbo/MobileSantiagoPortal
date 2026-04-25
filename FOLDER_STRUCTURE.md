# Barangay Santiago Portal - Folder Structure

## Current App Structure

```
app/
├── page.tsx                    # Landing page
├── globals.css                 # Global styles with green theme (#10b981)
├── layout.tsx                  # Root layout with auth provider
│
├── login/
│   ├── page.tsx               # Login selection page
│   ├── resident/
│   │   └── page.tsx           # Resident login
│   └── official/
│       └── page.tsx           # Official login (redirects to /official/dashboard)
│
├── register/
│   └── resident/
│       └── page.tsx           # Resident registration
│
├── resident (USER PORTAL)
│   ├── layout.tsx             # Resident layout with sidebar
│   ├── layout.module.css      # Resident layout styles
│   ├── dashboard/
│   │   └── page.tsx           # Dashboard - Shows resident stats, recent announcements
│   ├── documents/
│   │   └── page.tsx           # Document requests - View/request documents
│   ├── announcements/
│   │   └── page.tsx           # View announcements from officials
│   ├── blotter/
│   │   └── page.tsx           # View blotter entries (incidents)
│   ├── ordinances/
│   │   └── page.tsx           # View barangay ordinances
│   └── profile/
│       └── page.tsx           # User profile - Edit personal information
│
├── official (OFFICIAL PORTAL)
│   ├── layout.tsx             # Official layout with sidebar (reuses resident sidebar)
│   ├── dashboard/
│   │   └── page.tsx           # Dashboard - Official stats and quick actions
│   ├── announcements/
│   │   └── page.tsx           # Post/manage announcements
│   ├── blotter/
│   │   └── page.tsx           # Manage and report incidents
│   ├── documents/
│   │   └── page.tsx           # [ADMIN ONLY] Process document requests
│   ├── residents/
│   │   └── page.tsx           # [ADMIN ONLY] Manage residents
│   ├── projects/
│   │   └── page.tsx           # [ADMIN ONLY] Manage projects and programs
│   ├── businesses/
│   │   └── page.tsx           # [ADMIN ONLY] Manage business permits
│   ├── assets/
│   │   └── page.tsx           # [ADMIN ONLY] Inventory management
│   └── profile/
│       └── page.tsx           # Official profile
│
├── api/
│   ├── auth/
│   │   └── login/
│   │       └── route.ts       # Login API endpoint
│   ├── residents/
│   │   └── route.ts           # Resident management API
│   ├── announcements/
│   │   └── route.ts           # Announcement API
│   ├── documents/
│   │   └── route.ts           # Document request API
│   └── blotter/
│       └── route.ts           # Blotter entry API
│
└── register/
    └── resident/
        └── page.tsx           # Resident registration
```

## User Roles

### RESIDENT
- **Access**: `/user/*` routes
- **Features**:
  - Dashboard (view stats)
  - Request documents
  - View announcements
  - View blotter entries
  - View ordinances
  - Edit profile

### OFFICIAL
- **Access**: `/official/*` routes
- **Features**:
  - Dashboard (view official-only stats)
  - Post announcements
  - Manage blotter entries (report incidents)
  - View profile
  - **ADMIN ONLY**: Full resident management, document processing, projects, businesses, assets

### ADMIN (Super Admin)
- **Access**: All `/official/*` routes including admin-only sections
- **Features**: Everything officials can do PLUS:
  - Full resident management (verify, approve, reject accounts)
  - Process document requests
  - Manage projects & programs
  - Manage business permits
  - Asset & inventory management
  - View reports and analytics

## Color Scheme
- **Primary Green**: `#10b981` (sidebar, buttons, highlights)
- **Text on Green**: `#f0fdf4` (light green text)
- **Background**: `#f8fafc` (light gray-blue)
- **Foreground**: `#1e293b` (dark text)

## Database Tables
1. **users** - User accounts (resident/official/admin)
2. **residents** - Resident information
3. **documents** - Document request tracking
4. **announcements** - Official announcements
5. **blotter** - Incident reports
6. **ordinances** - Barangay ordinances
7. **officials** - Official positions and permissions
8. **projects** - Community projects
9. **businesses** - Business permits
10. **assets** - Barangay assets inventory
11. **activity_logs** - System activity tracking

## Key Routes
- `/` - Landing page
- `/login` - Select role (resident/official)
- `/login/resident` - Resident login
- `/login/official` - Official login
- `/register/resident` - Resident registration
- `/user/*` - Resident portal (requires role: resident)
- `/official/*` - Official portal (requires role: official | admin)

## Authentication Flow
1. User visits landing page
2. Clicks "Resident Login" or "Official Login"
3. Enters credentials
4. API validates against Supabase
5. AuthContext stores user info
6. Redirect to appropriate dashboard
7. Layouts check user role before rendering

## Supabase Integration
- All user data stored in Supabase
- Real-time database connections
- Row-Level Security (RLS) policies enforced
- User authentication via Supabase Auth

## Next Steps for Integration
1. Deploy Supabase schema from `scripts/supabase-schema.sql`
2. Update `.env.local` with Supabase URL and API key
3. Test each page with real Supabase data
4. Remove any remaining mock data
5. Deploy to Vercel
