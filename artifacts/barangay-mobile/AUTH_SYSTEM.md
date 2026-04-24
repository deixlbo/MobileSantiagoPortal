# Barangay Santiago Portal - Authentication System

## Overview
Complete role-based authentication system for Barangay Santiago Portal with separate login and registration flows for residents and officials.

## User Roles

### Residents
- Can self-register through `/register/resident`
- Access via `/login/resident`
- Full dashboard with announcements, documents, blotter, and profile
- Can request barangay documents
- Can file incident reports (blotter)

### Officials
- No self-registration - pre-configured accounts only
- Access via `/login/official`
- Admin dashboard with management tools
- Can process documents and manage residents
- Can post announcements and view blotter reports

## Demo Accounts

### Residents
- **Email**: juan@email.com
- **Password**: Any string with 4+ characters
- **Email**: maria@email.com
- **Password**: Any string with 4+ characters

### Officials (Pre-configured)
- **captain@brgy-santiago.gov.ph** - Barangay Captain
- **secretary@brgy-santiago.gov.ph** - Barangay Secretary
- **kagawad@brgy-santiago.gov.ph** - Barangay Kagawad
- **Password**: Any string with 4+ characters (demo only)

## Authentication Routes

### Public Routes
- `/login/resident` - Resident login page
- `/login/official` - Official login page
- `/register/resident` - Resident registration page

### Protected Routes

#### Resident Routes
- `/(resident)/dashboard` - User dashboard
- `/(resident)/announcements` - View announcements
- `/(resident)/documents` - Request documents
- `/(resident)/blotter` - File incident reports
- `/(resident)/profile` - User profile & settings

#### Official Routes
- `/(official)/dashboard` - Admin dashboard
- `/(official)/residents` - Manage residents
- `/(official)/announcements` - Post announcements
- `/(official)/documents` - Process documents
- `/(official)/blotter` - View blotter reports
- `/(official)/profile` - Official profile

## Authentication Context

### useAuth() Hook
```typescript
interface AuthContextType {
  user: User | null
  loading: boolean
  authError: string | null
  login: (email: string, password: string, role: UserRole) => Promise<boolean>
  createResidentUser: (userData) => Promise<boolean>
  logout: () => Promise<void>
  clearError: () => void
}
```

### User Data Structure
```typescript
interface User {
  uid: string
  email: string
  fullName: string
  role: 'resident' | 'official'
  address?: string
  phone?: string
}
```

## Registration Fields (Residents Only)

1. **Full Name** (required) - User's full name
2. **Email** (required) - Unique email address
3. **Password** (required) - Minimum 6 characters
4. **Confirm Password** (required) - Must match password
5. **Phone** (required) - Contact phone number
6. **Address** (required) - Complete residential address
7. **Purok** (required) - Neighborhood/block selection

## Key Features

### Authentication
- ✅ Email-based login
- ✅ Password validation (minimum length)
- ✅ Role-based access control
- ✅ Session persistence with localStorage
- ✅ Automatic redirects for unauthorized access

### Registration
- ✅ Self-registration for residents only
- ✅ Input validation (email format, password strength)
- ✅ Duplicate email prevention
- ✅ Auto-login after successful registration
- ✅ Clear error messages

### Protected Layouts
- ✅ Auth checks on route entry
- ✅ Loading states during verification
- ✅ Automatic redirects to appropriate login page
- ✅ Sidebar navigation based on user role
- ✅ Logout functionality in profile page

## Storage

### localStorage Keys
- `barangay_user` - Current logged-in user (JSON)
- `barangay_registered_residents` - Array of registered residents (JSON)

### Security Notes
- **Demo/Development Only**: Passwords stored in localStorage (NOT production-ready)
- Use proper password hashing (bcrypt) for production
- Implement secure session management (HTTP-only cookies)
- Add CSRF protection and rate limiting
- Enable HTTPS only in production

## Page Features

### Resident Dashboard
- Quick action cards (Request Document, File Blotter, View Announcements)
- Stats cards (Total Requests, Approved, In Progress)
- Recent announcements
- Recent document requests

### Resident Announcements
- List of all barangay announcements
- Priority indicators (High, Medium, Low)
- Category badges (Event, Notice, Opportunity)
- Date display
- Icon-based visual identification

### Resident Documents
- Current document requests table
- Request new document interface
- Multiple document types:
  - Barangay Clearance
  - Residency Certificate
  - Good Moral Character
  - Business Permit
  - Travel Authority
  - Special Request

### Resident Blotter
- File new incident report button
- List of incident reports with:
  - Unique report ID
  - Incident type
  - Description
  - Status tracking
  - Date reported

### Resident Profile
- View profile information
- Edit profile button
- Logout button
- Account settings section:
  - Change Password
  - Notification Preferences
  - Privacy Settings

## Error Handling

### Login Errors
- "No resident account: juan@email.com" - Account not found
- "No official account found" - Official account not found
- "Invalid password" - Wrong password
- "Invalid password (4+ chars)" - Password too short

### Registration Errors
- "Full name is required" - Missing full name
- "Invalid email format" - Invalid email
- "Password must be at least 6 characters" - Weak password
- "Phone number is required" - Missing phone
- "Address is required" - Missing address
- "Purok is required" - Purok not selected
- "Email already registered" - Duplicate email
- "Passwords do not match" - Password confirmation mismatch

## Next Steps for Production

1. **Database Integration**
   - Replace localStorage with database (PostgreSQL, MongoDB, etc.)
   - Implement proper user records management

2. **Security Enhancements**
   - Implement bcrypt for password hashing
   - Add JWT/session tokens with expiration
   - Enable HTTPS only
   - Implement CSRF protection
   - Add rate limiting for login attempts

3. **Email Verification**
   - Verify email addresses during registration
   - Reset password via email
   - Email notifications for account activity

4. **Admin Features**
   - User management dashboard
   - Approve/reject resident registrations
   - Audit logs for all actions
   - Account suspension/deletion

5. **Compliance**
   - GDPR compliance for data storage
   - Privacy policy implementation
   - Terms and conditions
   - Data retention policies

## Files Structure

```
app/
├── layout.tsx                    # Root layout with AuthProvider
├── globals.css                   # Global styles
├── login/
│   ├── resident/page.tsx        # Resident login
│   ├── official/page.tsx        # Official login
│   └── login.module.css         # Login styles
├── register/
│   └── resident/
│       ├── page.tsx             # Registration page
│       └── register.module.css   # Registration styles
├── (resident)/
│   ├── layout.tsx               # Protected resident layout
│   ├── layout.module.css
│   ├── dashboard/
│   │   ├── page.tsx
│   │   └── dashboard.module.css
│   ├── announcements/
│   │   ├── page.tsx
│   │   └── announcements.module.css
│   ├── documents/
│   │   ├── page.tsx
│   │   └── documents.module.css
│   ├── blotter/
│   │   ├── page.tsx
│   │   └── blotter.module.css
│   └── profile/
│       ├── page.tsx
│       └── profile.module.css
└── (official)/
    ├── layout.tsx               # Protected official layout
    ├── layout.module.css
    ├── dashboard/
    │   ├── page.tsx
    │   └── dashboard.module.css
    ├── residents/page.tsx
    ├── announcements/page.tsx
    ├── documents/page.tsx
    ├── blotter/page.tsx
    └── profile/page.tsx

lib/
├── context/
│   ├── AuthContext.tsx          # Authentication context with login & registration
│   └── ThemeContext.tsx
├── types/
│   └── index.ts                 # User and other type definitions
└── hooks/
    └── useApi.ts                # Custom API hook

components/
└── layout/
    └── Sidebar.tsx              # Navigation sidebar for both roles
```
