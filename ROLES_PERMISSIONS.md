# 👥 User Roles & Permissions Guide

## 3-Tier Role System

The Barangay Santiago Portal uses a 3-tier permission system:

---

## 1. 👨‍🌾 RESIDENT

### Access Routes
- `/user/dashboard` - View dashboard
- `/user/documents` - Request documents (clearance, indigency, etc.)
- `/user/announcements` - View community announcements
- `/user/blotter` - View public incident reports
- `/user/ordinances` - View barangay ordinances
- `/user/profile` - Edit profile

### Permissions
- ✅ View own profile & account info
- ✅ Request official documents
- ✅ Track document request status
- ✅ View announcements
- ✅ View blotter entries (read-only)
- ✅ Download ordinances
- ❌ Cannot manage other residents
- ❌ Cannot post announcements
- ❌ Cannot process documents
- ❌ Cannot access admin features

---

## 2. 🎯 OFFICIAL

### Access Routes
- `/admin/dashboard` - Official portal dashboard
- `/admin/announcements` - Create & manage announcements
- `/admin/blotter` - Manage incident reports
- `/admin/profile` - Edit official profile

### Features Available
```
✅ Post & manage announcements
✅ Create & track blotter entries
✅ View pending documents (read-only)
✅ Edit own official profile
❌ View all residents
❌ Approve/reject registrations
❌ Process document requests
❌ Manage other officials
❌ Access reports & analytics
❌ System settings
```

### Use Cases
- **Barangay Captain** - Posts official announcements, manages incidents
- **Barangay Secretary** - Updates documents, maintains records
- **Kagawad** - Reports incidents, posts community updates

---

## 3. 👑 ADMIN (Super Admin)

### Access Routes
- `/admin/dashboard` - Full super admin panel
- `/admin/residents` - View & manage all residents
- `/admin/documents` - Process all document requests
- `/admin/announcements` - Full announcement management
- `/admin/blotter` - Complete incident management
- `/admin/projects` - Manage community projects
- `/admin/businesses` - Business permit management
- `/admin/assets` - Inventory & asset tracking
- `/admin/profile` - Admin profile

### 12 Complete Features

#### 1️⃣ **Dashboard**
- Total residents count
- Pending approvals count
- Document requests status
- Blotter cases overview
- Quick stats & analytics

#### 2️⃣ **Resident Management**
- View all residents list
- Approve/reject registration
- Edit resident information
- Deactivate/reactivate accounts
- View complete resident profiles
- Search & filter residents

#### 3️⃣ **Verification & Approval System**
- Approve pending resident accounts
- Reject with custom reasons
- Status tracking (pending → active → rejected)
- Bulk approval operations

#### 4️⃣ **Document Request Management**
- View all document requests
- Approve & process requests
- Reject with feedback
- Generate downloadable documents
- Track document status
- Send document reminders

#### 5️⃣ **Document Reminder System** (NEW)
- Send missing document requests
- Add custom messages
- Track compliance
- Auto-generate reminders

#### 6️⃣ **Resident Activity Logs**
- Login history
- Document requests made
- File uploads
- Profile changes
- Admin actions audit trail

#### 7️⃣ **Official Management**
- Create new official accounts
- Assign roles (Captain, Secretary, Kagawad)
- Edit official permissions
- Remove/deactivate officials
- View official activity logs

#### 8️⃣ **Announcements**
- Create emergency alerts
- Post community updates
- Schedule announcements
- Edit/delete announcements
- View announcement analytics

#### 9️⃣ **Blotter & Incident System**
- Record complaints & incidents
- Track case status
- Upload evidence
- Assign to officers
- Case closure management
- Incident statistics

#### 🔟 **Reports & Analytics**
- Resident statistics & demographics
- Document request reports
- Document processing time metrics
- Incident trend analysis
- Export to PDF/Excel
- Custom report generation

#### 1️⃣1️⃣ **Security & Access Control**
- Role-based access control
- Activity logging
- Password policies
- Login audit trail
- IP whitelisting (optional)
- Two-factor authentication settings

#### 1️⃣2️⃣ **Settings & Configuration**
- Barangay information
- System settings
- Document templates
- Email configuration
- Backup management
- System version info

---

## 🤖 AI CHATBOT ASSISTANT (Admin Only)

### Purpose
Help admins manage data faster and automate tasks.

### Capabilities
- 📊 Smart queries: "How many residents are pending?"
- 🔍 Data search: "Find Juan Dela Cruz"
- 📋 Report generation: "Generate monthly report"
- ✍️ Message generation: "Create announcement for vaccination"
- 🔔 Smart suggestions: "These 10 users have incomplete documents"

### Implementation
- Floating chat button in bottom-right
- Real-time database queries
- OpenAI API integration (optional)
- Chat history logging

---

## 📊 Permission Matrix

| Feature | Resident | Official | Admin |
|---------|----------|----------|-------|
| View Dashboard | ✅ | ✅ | ✅ |
| Request Documents | ✅ | ❌ | ✅ |
| View Announcements | ✅ | ✅ | ✅ |
| Post Announcements | ❌ | ✅ | ✅ |
| View Blotter | ✅ (RO) | ✅ | ✅ |
| Manage Blotter | ❌ | ✅ | ✅ |
| View Residents | ❌ | ❌ | ✅ |
| Approve Residents | ❌ | ❌ | ✅ |
| Process Documents | ❌ | ❌ | ✅ |
| Manage Officials | ❌ | ❌ | ✅ |
| Reports & Analytics | ❌ | ❌ | ✅ |
| System Settings | ❌ | ❌ | ✅ |
| AI Chatbot | ❌ | ❌ | ✅ |

---

## 🔐 Security Notes

1. **Role Verification**: Every API endpoint checks user role
2. **Route Protection**: Protected routes redirect unauthorized users to login
3. **Database Level**: RLS policies enforce role-based data access
4. **Audit Trail**: All admin actions are logged
5. **Session Management**: Secure session cookies with auto-timeout

---

## 🚀 Assigning Roles

### In Supabase Auth
```sql
-- Update user role
UPDATE users SET role = 'admin' WHERE id = 'user_id';
UPDATE users SET role = 'official' WHERE id = 'user_id';
UPDATE users SET role = 'resident' WHERE id = 'user_id';
```

### Creating Official Accounts
1. Admin creates official account in user management
2. Assigns role (Captain, Secretary, etc.)
3. Assigns permissions
4. Official receives credentials
5. Official can login to `/admin` portal

---

## 📱 Mobile Responsive

All features are fully responsive on:
- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)

---

## 🔄 User Flow

### Resident Registration
1. Go to `/register/resident`
2. Fill in details
3. Account created (status: pending)
4. Admin approves in resident management
5. Can login with credentials

### Official Creation
1. Admin creates in official management
2. Assign position & permissions
3. Generate temporary password
4. Official login at `/login/official`
5. Access `/admin` portal with limited features

### Admin Access
1. Super admin role assigned in Supabase
2. Login with admin credentials
3. Full access to all `/admin` pages
4. No feature restrictions

---

## 🎯 Next Steps

- [ ] Set up Supabase RLS policies for role-based access
- [ ] Create official account management UI
- [ ] Implement AI chatbot for admins
- [ ] Add audit logging
- [ ] Set up email notifications
- [ ] Configure backup system
