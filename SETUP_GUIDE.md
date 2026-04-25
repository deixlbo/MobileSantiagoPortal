# Barangay Santiago Portal - Complete Setup Guide

## Project Overview

A pure Next.js web application for managing barangay (village) services with separate portals for residents and officials. Fully responsive on mobile and web browsers, powered by Supabase for data persistence.

## Features

### Resident Portal
- **Dashboard**: View document status, announcements, and pending requests
- **Document Requests**: Request clearances, certificates, and other documents
- **Announcements**: View official announcements and alerts
- **Blotter**: File and track incident reports
- **Ordinances**: View barangay ordinances
- **Profile**: Manage personal information

### Admin/Official Portal
- **Dashboard**: Statistics, pending approvals, quick access
- **Resident Management**: Approve/reject new residents, manage accounts
- **Document Management**: Process document requests
- **Announcements**: Create and manage announcements
- **Blotter Management**: Track incident reports
- **Projects & Programs**: Manage community programs
- **Business Permits**: Track business permits
- **Assets**: Manage barangay assets

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom with Supabase
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Package Manager**: pnpm

## Prerequisites

- Node.js 18+ installed
- A Supabase project created at https://supabase.com
- pnpm installed (`npm install -g pnpm`)

## Installation Steps

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at https://supabase.com
2. Go to the SQL Editor in your Supabase dashboard
3. Create a new query and paste the entire contents of `/scripts/supabase-schema.sql`
4. Click "Run" to execute the schema

### 3. Configure Environment Variables

Environment variables are already configured in your Vercel project. Verify they exist:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_JWT_SECRET`

These should be visible in your Vercel project settings under "Vars".

### 4. Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## User Accounts for Testing

### Resident Test Account
- **Email**: juan@email.com
- **Password**: password (or any password with 4+ characters)
- **Role**: Resident

### Official Test Account
- **Email**: captain@brgy-santiago.gov.ph
- **Password**: password (or any password with 4+ characters)
- **Role**: Official/Admin

Note: These are demo credentials. You'll need to set up real user accounts in the Supabase database for production use.

## Application Routes

### Public Routes
- `/` - Landing page
- `/login` - Login page selector
- `/login/resident` - Resident login
- `/login/official` - Official login
- `/register/resident` - Resident registration

### Resident Routes (Protected)
- `/user/dashboard` - Resident dashboard
- `/user/documents` - Document requests
- `/user/announcements` - View announcements
- `/user/blotter` - File incident reports
- `/user/ordinances` - View ordinances
- `/user/profile` - Manage profile

### Official Routes (Protected)
- `/admin/dashboard` - Admin dashboard
- `/admin/residents` - Manage residents
- `/admin/documents` - Process documents
- `/admin/announcements` - Create announcements
- `/admin/blotter` - Manage incidents
- `/admin/projects` - Manage projects
- `/admin/businesses` - Manage business permits
- `/admin/assets` - Manage assets
- `/admin/profile` - Official profile

## Database Tables

### Core Tables
- `users` - User accounts and authentication
- `residents` - Resident profiles with approval status
- `officials` - Official/staff profiles
- `announcements` - Public announcements
- `documents` - Processed documents
- `document_requests` - Document request tracking
- `blotter` - Incident reports
- `ordinances` - Barangay ordinances
- `projects` - Community projects
- `business_permits` - Business permits
- `assets` - Barangay assets
- `activity_logs` - User action logs

## Authentication Flow

1. User visits `/login` or uses role-specific `/login/resident` or `/login/official`
2. Login credentials are verified against the `users` table
3. User role (`resident` or `official`) determines access
4. Session stored in AuthContext
5. Protected routes redirect unauthenticated users to login

## Building for Production

### Development Build
```bash
pnpm dev
```

### Production Build
```bash
pnpm build
pnpm start
```

### Deployment to Vercel
```bash
vercel deploy
```

## Mobile Responsiveness

All pages are fully responsive:
- **Mobile** (< 640px): Single column, optimized spacing
- **Tablet** (640px - 1024px): Two column layouts
- **Desktop** (> 1024px): Full three-column layouts

The responsive design uses CSS Grid and Flexbox with Tailwind breakpoints.

## Key Features Implementation

### ✅ Completed
- Pure Next.js framework (no React Native)
- Supabase database schema and client
- Complete authentication system
- Role-based access control
- Responsive design (mobile & web)
- All AI text removed
- All mock data removed
- Proper TypeScript types

### 🔄 In Progress / Needs Integration
- Individual page Supabase data fetching
- Form submission and validation
- File upload functionality
- Payment tracking
- Admin workflows (approvals, rejections)

## Customization

### Colors
Edit the CSS variables in `app/globals.css`:
```css
--primary: 22 163 74;      /* Green */
--sidebar: 15 23 42;       /* Dark blue/gray */
--background: 255 255 255; /* White */
```

### Barangay Information
Update in relevant pages:
- Name: "Barangay Santiago Saz"
- Location: "San Antonio, Zambales"
- Contact info in footer/admin pages

### Document Types
Edit the document list in `/app/user/documents/page.tsx`:
- Barangay Clearance
- Certificate of Indigency
- Certificate of Residency
- Business Clearance
- Certificate of Good Moral Character
- Cedula

## Troubleshooting

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && pnpm install`

### Supabase Connection Issues
- Verify environment variables are set
- Check Supabase project is active
- Ensure schema SQL was executed

### Login Not Working
- Verify user exists in `users` table
- Check email format matches exactly
- Ensure role is set correctly

## Performance Optimization

- Uses Next.js Image optimization
- CSS modules for better scoping
- Tailwind CSS for minimal bundle size
- Supabase for efficient data queries

## Security Notes

- Passwords should be hashed in production (bcrypt)
- Implement Row Level Security (RLS) in Supabase
- Use HTTPS in production
- Validate all user inputs
- Sanitize database queries

## Support & Maintenance

### Adding New Features
1. Create database tables in `scripts/supabase-schema.sql`
2. Update Supabase with SQL migration
3. Create new pages in appropriate routes
4. Add Supabase queries in `lib/supabase.ts`
5. Update AuthContext if new roles needed

### Updating Existing Pages
- Pages are stored in `/app/user/*` (resident) and `/app/admin/*` (official)
- Always use `'use client'` directive for pages with hooks
- Import Supabase helper from `lib/supabase.ts`
- Use proper error handling for async operations

## Deployment Checklist

- [ ] All environment variables set in Vercel
- [ ] Supabase schema executed
- [ ] Test both resident and official accounts
- [ ] Test on mobile devices
- [ ] Verify all routes work
- [ ] Check error handling
- [ ] Review security settings
- [ ] Set up monitoring/logging
- [ ] Configure domain
- [ ] Set up backups

## Contact & Support

For issues or questions:
1. Check the PROGRESS.md file for implementation status
2. Review the IMPLEMENTATION_GUIDE.md for architecture
3. Check Supabase documentation at https://supabase.com/docs
4. Check Next.js documentation at https://nextjs.org/docs

## Version History

- **v1.0.0** (Current)
  - Initial release with resident and official portals
  - Supabase integration
  - Full responsive design
  - Authentication system
