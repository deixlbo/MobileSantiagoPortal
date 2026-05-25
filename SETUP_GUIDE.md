# Barangay Santiago Management System - Setup Guide

## System Overview
Complete digital management system for Barangay Santiago including:
- Resident Dashboards (Resident & Official Portals)
- Document Request System with auto-generation
- Blotter Management
- Announcements & Ordinances
- Projects & Reports
- Notifications

---

## 🚀 Quick Start - Local Development

### Prerequisites
- Node.js 18+ (check with `node --version`)
- npm, pnpm, or yarn (check lockfile in project)
- Git

### Installation & Running Locally

#### For **Resident Portal**:
```bash
# Navigate to project directory
cd /vercel/share/v0-project

# Install dependencies (this project uses pnpm based on lock file)
pnpm install

# Start development server
pnpm dev

# Open in browser
# http://localhost:3000/resident
```

#### For **Official Portal**:
```bash
# Same installation, different route
# http://localhost:3000/official
```

#### For **Login Pages**:
```bash
# Resident Login
# http://localhost:3000/resident/login

# Official Login
# http://localhost:3000/official/login
```

### Build & Production
```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

---

## 📋 System Features & Pages

### RESIDENT PORTAL (`/resident`)

#### 1. **Dashboard** (`/resident`)
- **Welcome Message**: Personalized greeting
- **Statistics Cards**: Total requests, pending approvals, approved docs
- **Notifications Preview**: Recent notifications with unread indicator
- **Document Requests**: Recent requests with status (Waiting for Approval/Ready to Release/Rejected)
- **Blotter Reports**: Incident reports submitted
- **Announcements**: Latest community announcements

**Updated in:** `/app/resident/page.tsx`

---

#### 2. **Documents Page** (`/resident/documents`)
**Workflow:**
1. Click "Available Documents" cards to view requirements
2. Dialog opens showing:
   - Document name & fee
   - Requirements list
   - Submission form
3. Submit request
4. Status updates:
   - 🟡 **Waiting for Official Approval** (pending)
   - 🟢 **Ready to Release** (approved)
   - 🔴 **Rejected - Please Resubmit** (rejected)

**Available Documents:**
- Barangay Clearance (PHP 50)
- Certificate of Residency (PHP 50)
- Certificate of Indigency (Free)
- Certificate of Solo Parent (PHP 50)
- Certificate of Business Closure (PHP 75)
- Barangay Business Clearance (PHP 100)
- Medical Assistance Certificate (Free)

**File:** `/app/resident/documents/page.tsx`

---

#### 3. **Blotter Management** (`/resident/blotter`)
- File new incident reports
- Track status: Pending → Processing → Resolved
- View only own reports (privacy)

---

#### 4. **Announcements** (`/resident/announcements`)
- View all barangay announcements
- Filter by date
- Search functionality

---

#### 5. **Ordinances** (`/resident/ordinances`)
- Browse barangay ordinances
- Search & filter by category
- Download PDF copies

---

#### 6. **Projects** (`/resident/projects`)
- View ongoing barangay projects
- Progress tracking
- Budget transparency

---

### OFFICIAL PORTAL (`/official`)

#### 1. **Dashboard** (`/official/dashboard`)
**Features:**
- Total verified residents count
- Pending document requests count
- Active blotter cases
- Recent activities
- Document approval trends
- Quick access buttons

---

#### 2. **Document Management** (`/official/documents`)
**Admin Actions:**
- View pending requests
- Approve request → Auto-generates document with:
  - Control number
  - Date stamp
  - Name (BOLD formatting)
  - Address (UNDERLINE formatting)
  - PDF copy stored
  - Notification sent to resident
- Reject request with reason
- Download/print approved documents

---

#### 3. **Resident Management** (`/official/residents`)
**Features:**
- Approve/reject registrations
- View resident profiles
- Edit resident information
- Filters: Purok, Gender, Age
- Household grouping
- ID verification upload

---

#### 4. **Blotter Management** (`/official/blotters`)
- Review all incident reports
- Update status: Pending → Ongoing → Resolved
- Schedule hearings
- Add notes/updates
- Notify residents

---

#### 5. **Announcements** (`/official/announcements`)
**Features:**
- Create new announcements
- Schedule posting (future date)
- Target specific audience
- Edit/delete announcements
- View publication status

---

#### 6. **Reports & Analytics** (`/official/reports`)
**Available Reports:**
- Population statistics
- Document requests trends
- Blotter cases summary
- Monthly activity report

---

#### 7. **User & Role Management** (`/official/settings/users`)
**Roles:**
- Admin (full access)
- Staff (document processing)
- Captain (approvals)

**Features:**
- Assign roles
- Restrict access by module
- Track user actions (audit log)
- Deactivate accounts

---

## 📊 Database Schema

### Tables Required
```sql
-- Users (Residents & Officials)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  password_hash VARCHAR,
  name VARCHAR,
  role ENUM('resident', 'staff', 'admin'),
  status ENUM('pending', 'verified', 'rejected'),
  created_at TIMESTAMP
);

-- Document Requests
CREATE TABLE document_requests (
  id UUID PRIMARY KEY,
  resident_id UUID,
  document_type VARCHAR,
  status ENUM('pending', 'approved', 'rejected'),
  control_number VARCHAR UNIQUE,
  fee_amount INT,
  created_at TIMESTAMP,
  approved_at TIMESTAMP
);

-- Blotter Reports
CREATE TABLE blotter_reports (
  id UUID PRIMARY KEY,
  resident_id UUID,
  title VARCHAR,
  description TEXT,
  status ENUM('pending', 'processing', 'resolved'),
  created_at TIMESTAMP
);

-- Announcements
CREATE TABLE announcements (
  id UUID PRIMARY KEY,
  title VARCHAR,
  content TEXT,
  created_by UUID,
  scheduled_for TIMESTAMP,
  is_published BOOLEAN,
  created_at TIMESTAMP
);
```

---

## 🔐 Authentication Flow

```
Resident Registration
  ↓
Submit Email + Password
  ↓
Account Created (Status: PENDING)
  ↓
Official Reviews + Verifies ID
  ↓
Status Updated to VERIFIED
  ↓
Resident Can Login & Access Portal
```

---

## 🔔 Notification System

**Triggered Events:**
- Document approved: "Your Barangay Clearance has been approved"
- Document rejected: "Your request was rejected. Please resubmit"
- New announcement: "New announcement: Community Health Drive"
- Blotter update: "Your incident report status changed to Processing"

**Delivery Channels:**
- In-app notifications (in dashboard)
- Email notifications (optional)
- SMS (optional, future feature)

---

## ⚙️ Configuration

### Environment Variables (.env.local)
```env
# Database
DATABASE_URL=your_database_url

# API
NEXT_PUBLIC_API_URL=http://localhost:3000

# File Storage
NEXT_PUBLIC_STORAGE_URL=your_storage_url

# Email (for notifications)
SMTP_HOST=your_smtp_host
SMTP_USER=your_email
SMTP_PASS=your_password
```

---

## 📱 Responsive Design

- **Mobile (< 640px)**: Single column, hamburger menu
- **Tablet (640px - 1024px)**: Two columns, sidebar visible
- **Desktop (> 1024px)**: Three columns, full sidebar, optimized layout

---

## 🎨 Design System

- **Primary Color**: Green (#166534)
- **Secondary Colors**: Amber (warnings), Red (errors), Emerald (success)
- **Font**: Geist (sans-serif)
- **Components**: shadcn/ui + Radix UI

---

## 🚨 Important Notes

### For Panel Presentation:
1. **"This is just encoding digitally"** → Response:
   - Automated document generation reduces manual errors
   - Faster processing (approval within hours, not days)
   - Transparent status tracking for residents

2. **"Sensitive data exposure"** → Security:
   - Role-based access control (RBAC)
   - Residents see only own data
   - Officials see all data with confidential fields marked
   - Audit logs track all actions

3. **"Where is intelligence?"** → Analytics:
   - Reports & Analytics page with trends
   - Population insights
   - Request processing times
   - Common request types

---

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Use different port
pnpm dev -- -p 3001
```

### Dependencies Error
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Build Failing
```bash
# Check for TypeScript errors
pnpm build

# Fix linting issues
pnpm lint -- --fix
```

---

## 📞 Support

For issues or questions, contact the development team or open an issue on GitHub.

---

**Last Updated:** May 5, 2026
**System Version:** 1.0
**Status:** Production Ready
