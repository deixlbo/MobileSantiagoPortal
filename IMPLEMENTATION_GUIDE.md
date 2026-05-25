# 🏛️ Barangay Santiago Management System

## Complete Implementation Guide

### 📋 What's Implemented

#### ✅ **Admin Dashboard** (`/official/dashboard`)
- **Key Metrics**: Total residents, pending documents, active blotters, verified accounts
- **Request Trends**: Line chart showing requests, approvals, rejections over time
- **Alerts System**: Overdue requests, pending items, unresolved cases
- **Recent Activities**: Real-time activity log
- **Quick Actions**: Navigate to main features

#### ✅ **Document Management System** (`/official/documents`)
- **10 Document Types**:
  - Barangay Clearance
  - Certificate of Residency
  - Certificate of Indigency
  - Certificate of Solo Parent
  - Barangay Business Clearance
  - Certificate of Business Closure
  - Certificate to File Action
  - Medical Assistance Certificate
  - Blotter Report
  - Settlement Agreement

- **Auto-Generation Features**:
  - Resident name auto-filled and **BOLD**
  - Address auto-filled and **UNDERLINED**
  - Control number auto-generated
  - Automatic date assignment
  - Professional HTML templates
  - Download as HTML documents

- **Admin Functions**:
  - View pending requests
  - Preview generated documents
  - Approve/Reject with reasons
  - Download approved documents
  - Filter by status

#### ✅ **Resident Dashboard** (`/resident/dashboard`)
- **Request Status Tracking**: View pending, approved, rejected requests
- **Quick Request Button**: Submit new document requests
- **Personal History**: See past requests
- **Notification Preview**: Unread notifications with count
- **Blotter Updates**: View submitted reports
- **Latest Announcements**: In-app announcement feed
- **Real-time Notifications**: Approval alerts, announcement updates

#### ✅ **Residents Management** (`/official/residents`)
- **Resident Listing**: All registered residents
- **Verification System**:
  - Pending verification
  - Verified accounts
  - Rejected applications
- **Filters**: By name, email, status, purok
- **Household Grouping**: Organize by purok
- **ID Verification**: Status tracking
- **Admin Actions**: Approve/Reject verification

#### ✅ **Blotter Management** (`/official/blotters`)
- **Report Submission** (Resident Side):
  - Submit incident report
  - View status updates
  - Track case progress

- **Admin Functions**:
  - View all reports
  - Assign status (Pending, Ongoing, Resolved)
  - Schedule hearings
  - Add case notes
  - Role-based access (residents see only own reports)

#### ✅ **Announcements** (`/official/announcements`)
- **Create Announcements**: Rich text content
- **Target Audience**: All residents, officials, or specific groups
- **Schedule Posting**: Post at specific times
- **Residents View**: Instant visibility to all residents
- **Real-time Notifications**: Automatic alerts sent

#### ✅ **Ordinances** (`/official/ordinances`)
- **Upload System**: Organize ordinances by category
- **Search Function**: Find ordinances by title/category
- **Download**: Residents can download PDFs
- **Category Organization**: Structured by topic

#### ✅ **Projects** (`/official/projects`)
- **Project Creation**: Title, description, timeline
- **Progress Tracking**: Visual progress updates
- **Budget Management**: Track budget vs. spent
- **Transparency Dashboard**: Residents can view progress
- **Location-based**: Organized by purok/location
- **Status Management**: Planning, Ongoing, Completed

#### ✅ **Role-Based Access Control (RBAC)**
- **Admin**: Full system access
- **Staff**: Document management, resident verification
- **Captain**: Overall oversight, final approvals
- **Resident**: Document requests, blotter reports, view-only access

#### ✅ **Notification System**
- **Approval Alerts**: "Your Barangay Clearance has been approved"
- **Rejection Notices**: With reason provided
- **Announcement Updates**: New announcements posted
- **Blotter Updates**: Case status changes
- **In-app Notifications**: Badge counter
- **Optional**: Email/SMS ready (can integrate Twilio)

#### ✅ **API Routes** (Backend Ready)
```
POST   /api/documents              - Create document request
GET    /api/documents              - Fetch requests
POST   /api/documents/approve      - Approve document
GET    /api/residents              - List residents
POST   /api/residents              - Register resident
PUT    /api/residents              - Update resident
GET    /api/blotters               - List blotter reports
POST   /api/blotters               - Submit report
PUT    /api/blotters               - Update status
GET    /api/announcements          - Get announcements
POST   /api/announcements          - Create announcement
GET    /api/notifications          - Get user notifications
POST   /api/notifications          - Create notification
GET    /api/projects               - List projects
POST   /api/projects               - Create project
PUT    /api/projects               - Update project progress
```

---

## 🚀 How to Run Locally

### Prerequisites
- **Node.js** 18+ ([Download](https://nodejs.org))
- **pnpm** (or npm/yarn)
  ```bash
  npm install -g pnpm
  ```

### Installation & Setup

1. **Navigate to project directory**:
   ```bash
   cd c:\Users\Axl denielle\Downloads\sazwebtry1
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```
   Or with npm:
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   pnpm dev
   ```
   Or with npm:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   ```
   http://localhost:3000
   ```

---

## 📱 Navigation & Features

### For Admin Users (Log in with admin account)

**Main URL**: `http://localhost:3000/official`

**Dashboard**: `http://localhost:3000/official/dashboard`
- View system statistics
- See request trends
- Monitor alerts
- Track activities

**Documents**: `http://localhost:3000/official/documents`
1. View pending requests
2. Click "Preview" to see document template
3. Click "Approve" → Enter O.R. number → Click "Generate & Approve"
   - Document is auto-generated with resident data
   - Control number assigned
   - Resident notified
4. Resident can then download

**Residents**: `http://localhost:3000/official/residents`
1. View all residents
2. Filter by status/purok
3. Click "View Details"
4. Click "Verify" for pending accounts
5. Accept or reject verification

**Blotters**: `http://localhost:3000/official/blotters`
1. View submitted reports
2. Assign status (Pending → Ongoing → Resolved)
3. Schedule hearing dates
4. Add case notes

**Announcements**: `http://localhost:3000/official/announcements`
1. Create new announcement
2. Select audience (all/residents/officials)
3. Optional: Schedule posting time
4. Publish
5. Residents notified instantly

**Projects**: `http://localhost:3000/official/projects`
1. Create project
2. Update progress %
3. Track budget
4. Mark as completed

### For Resident Users

**Main URL**: `http://localhost:3000/resident`

**Dashboard**: `http://localhost:3000/resident/dashboard`
1. **Request Document**:
   - Select document type
   - Enter purpose
   - Click "Submit Request"
   - Check notification for approval

2. **View Requests**:
   - See status of all requests
   - Download approved documents
   - Check rejection reasons

3. **View Notifications**:
   - Click bell icon
   - See approval alerts
   - View announcements
   - Track blotter updates

4. **Check Announcements**:
   - Scroll to see latest posts
   - Click to read details

5. **File Blotter Report**:
   - Click "File New Report"
   - Enter incident details
   - Submit
   - Track case status

---

## 🔐 Security Features Implemented

- ✅ Role-based access control (Admin/Staff/Captain/Resident)
- ✅ Residents only see their own documents & reports
- ✅ Admin-only access to analytics & user management
- ✅ Verification system to prevent fake registrations
- ✅ ID verification with admin approval
- ✅ Confidential field access (role-based)
- ✅ Activity logging for audit trail

---

## 📊 Addressing Panel Concerns

### "This is just encoding digitally"
**Solution Provided**:
- ✅ Automated document generation
- ✅ Reduced manual errors (auto-fill)
- ✅ Faster processing (instant approval)
- ✅ Control number tracking
- ✅ Audit trail of all actions

### "What if fake users register?"
**Solution Provided**:
- ✅ ID upload requirement
- ✅ Admin verification required
- ✅ Verification status: Pending → Verified → Rejected
- ✅ Fake accounts cannot access system

### "Where is intelligence?"
**Analytics & Reports Page** (`/official/reports`):
- ✅ Population statistics
- ✅ Request trends
- ✅ Document approval rates
- ✅ Blotter case types
- ✅ Project progress
- ✅ Budget analysis

### "Sensitive data exposure"
**Protections**:
- ✅ Role-based access
- ✅ Residents see only own reports
- ✅ Confidential flags on sensitive documents
- ✅ Activity logging
- ✅ Audit trail

---

## 📦 Project Structure

```
sazwebtry1/
├── app/
│   ├── api/                    # Backend API routes
│   │   ├── documents/
│   │   ├── documents/approve/
│   │   ├── residents/
│   │   ├── blotters/
│   │   ├── announcements/
│   │   ├── notifications/
│   │   └── projects/
│   │
│   ├── official/               # Admin pages
│   │   ├── dashboard/page.tsx  # Admin dashboard
│   │   ├── documents/          # Document management
│   │   ├── residents/          # Resident management
│   │   ├── blotters/           # Blotter system
│   │   ├── announcements/      # Post announcements
│   │   ├── ordinances/         # Upload ordinances
│   │   ├── projects/           # Project tracking
│   │   └── users/              # User & role management
│   │
│   └── resident/               # Resident pages
│       ├── dashboard/page.tsx  # Resident dashboard
│       ├── announcements/      # View announcements
│       ├── blotter/            # Submit reports
│       ├── documents/          # Request documents
│       └── projects/           # View projects
│
├── components/
│   ├── ui/                     # Shadcn UI components
│   └── page-transition.tsx     # Page animations
│
├── lib/
│   ├── database.ts             # Database types & schemas
│   ├── document-generator.ts   # Document templates
│   ├── mock-auth.ts            # Mock authentication
│   └── utils.ts                # Utility functions
│
└── public/
    └── images/                 # Barangay photos
```

---

## 🎯 Key Endpoints

### Documents
- `POST /api/documents` - Submit request
- `GET /api/documents?residentId=X` - Get resident's requests
- `POST /api/documents/approve` - Approve & generate document

### Residents
- `GET /api/residents` - List all residents
- `POST /api/residents` - Register new resident
- `PUT /api/residents` - Update verification status
- `GET /api/residents?status=pending` - Filter by status

### Blotters
- `POST /api/blotters` - Submit report
- `GET /api/blotters` - List all reports
- `PUT /api/blotters` - Update status & hearing date

### Announcements
- `POST /api/announcements` - Create announcement
- `GET /api/announcements` - Get active announcements

### Notifications
- `POST /api/notifications` - Create notification
- `GET /api/notifications?userId=X` - Get user notifications
- `PUT /api/notifications` - Mark as read

---

## ⚙️ Configuration

### Environment Variables (Optional)
Create `.env.local`:
```env
NEXT_PUBLIC_APP_NAME=Barangay Santiago Management System
NEXT_PUBLIC_BARANGAY_CAPTAIN=Rolando C. Borja
```

---

## 🧪 Testing the System

### Step 1: Test Admin Dashboard
1. Go to `/official/dashboard`
2. View stats, trends, and alerts

### Step 2: Test Document Generation
1. Go to `/official/documents`
2. Find pending request (e.g., "Juan Dela Cruz - Barangay Clearance")
3. Click "Approve"
4. Fill O.R. number (optional)
5. Click "Generate & Approve"
6. Document HTML is generated instantly
7. Click "Download" to save

### Step 3: Test Resident Verification
1. Go to `/official/residents`
2. Filter by "Pending"
3. Click "Verify" on pending resident
4. Accept verification
5. Status changes to "Verified"

### Step 4: Test Resident Dashboard
1. Go to `/resident/dashboard`
2. Select "Barangay Clearance"
3. Enter purpose "Job application"
4. Click "Submit Request"
5. See request appear in admin dashboard immediately

### Step 5: Test Announcements
1. Go to `/official/announcements`
2. Create announcement "Community Clinic"
3. Set target audience: "Residents"
4. Publish
5. Go to `/resident/dashboard` → See announcement

---

## 🔄 Connection Flow Examples

### Document Request Flow
```
Resident Request 
  ↓
Admin Reviews
  ↓
Admin Clicks Approve
  ↓
System Generates Document (auto-fill name, date, address)
  ↓
Control Number Assigned
  ↓
PDF Created
  ↓
Notification Sent to Resident
  ↓
Resident Downloads Document
```

### Resident Verification Flow
```
Resident Registers
  ↓
Status = PENDING
  ↓
Upload ID
  ↓
Admin Reviews
  ↓
Admin Clicks Verify
  ↓
Status = VERIFIED
  ↓
Resident Can Now Use System
```

### Blotter Case Flow
```
Resident Files Report
  ↓
Status = PENDING
  ↓
Admin Assigns Status: ONGOING
  ↓
Schedule Hearing
  ↓
Admin Updates to RESOLVED
  ↓
Resident Notified
```

---

## 📞 Support Contact

**Barangay Captain**: Rolando C. Borja  
**System Administrator**: Available during office hours  
**Location**: Barangay Santiago, San Antonio, Zambales

---

## 📝 Notes

- All data is currently stored in-memory (for demo purposes)
- For production: Replace with Supabase or your preferred database
- Document generation uses HTML templates (can add PDF export)
- Email/SMS notifications can be integrated via Twilio or SendGrid
- All timestamps are UTC (adjust as needed)

---

**Version**: 1.0.0  
**Last Updated**: May 3, 2026  
**Status**: Ready for Testing ✅
