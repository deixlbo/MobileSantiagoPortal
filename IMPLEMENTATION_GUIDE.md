# Barangay Santiago Portal - Implementation Guide

## Supabase Setup

The database schema is defined in `/scripts/supabase-schema.sql`. To initialize your database:

1. Go to your Supabase project dashboard
2. Open the SQL editor
3. Copy and paste the contents of `scripts/supabase-schema.sql`
4. Execute the SQL

## Database Tables

- **users**: Authentication and user roles
- **residents**: Resident profile information and approval status
- **officials**: Official/staff profiles
- **announcements**: Public announcements and alerts
- **documents**: Clearance, residency certificates, etc.
- **document_requests**: Resident document requests
- **blotter**: Incident reports
- **ordinances**: Barangay ordinances and regulations
- **projects**: Community projects and programs
- **business_permits**: Business permits and renewals
- **assets**: Barangay assets and inventory
- **activity_logs**: User action tracking

## Environment Variables

The following Supabase environment variables are already configured:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- SUPABASE_JWT_SECRET

## File Structure

```
app/
├── login/
│   ├── resident/page.tsx      # Resident login
│   └── official/page.tsx      # Official/Admin login
├── user/                       # Resident Portal
│   ├── dashboard/page.tsx
│   ├── documents/page.tsx
│   ├── announcements/page.tsx
│   ├── blotter/page.tsx
│   ├── ordinances/page.tsx
│   └── profile/page.tsx
├── admin/                      # Official Admin Portal
│   ├── dashboard/page.tsx
│   ├── residents/page.tsx
│   ├── documents/page.tsx
│   ├── announcements/page.tsx
│   ├── blotter/page.tsx
│   ├── projects/page.tsx
│   ├── businesses/page.tsx
│   ├── assets/page.tsx
│   └── profile/page.tsx
lib/
├── supabase.ts               # Supabase client and helpers
├── context/
│   ├── AuthContext.tsx       # Authentication state
│   └── ThemeContext.tsx      # Theme management
└── types.ts                  # TypeScript types

scripts/
└── supabase-schema.sql       # Database schema
```

## Resident Portal Features

1. **Dashboard**: Overview of document status, announcements, and quick actions
2. **Documents**: Request and track clearances, residency certificates, etc.
3. **Announcements**: View barangay announcements and alerts
4. **Blotter**: File incident reports and view case status
5. **Ordinances**: View barangay ordinances and regulations
6. **Profile**: Update personal information and preferences

## Admin Portal Features

1. **Dashboard**: Statistics, pending approvals, recent activities
2. **Residents Management**: View, approve/reject, deactivate resident accounts
3. **Documents Management**: Approve/reject document requests, track processing
4. **Announcements**: Post, edit, delete announcements
5. **Blotter**: View incident reports, assign cases, update status
6. **Projects**: Manage community projects and programs
7. **Businesses**: Manage business permits
8. **Assets**: Manage barangay assets and inventory
9. **Profile**: Official profile and password management

## Responsive Design

All pages are built with mobile-first responsive design:
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Works seamlessly on mobile devices and web browsers
- Touch-friendly components

## Data Binding

All mock data has been removed. Pages now:
- Connect to Supabase for real-time data
- Use proper authentication for access control
- Implement role-based features (resident vs official)
- Log all user activities

## Next Steps

1. Run `pnpm install` to install all dependencies
2. Set up Supabase and execute the schema SQL
3. Start dev server: `pnpm dev`
4. Build for production: `pnpm build`

## Deployment

The application is ready for deployment to Vercel:
1. Connect your GitHub repository
2. Vercel will auto-detect Next.js
3. Add Supabase environment variables
4. Deploy with `vercel deploy`
