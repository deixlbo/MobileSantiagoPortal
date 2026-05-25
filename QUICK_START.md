# Barangay Santiago - Quick Start Guide

## ⚡ 60-Second Setup

```bash
# 1. Enter project directory
cd /vercel/share/v0-project

# 2. Install dependencies
pnpm install

# 3. Start development server
pnpm dev

# 4. Open in browser
# Resident: http://localhost:3000/resident
# Official: http://localhost:3000/official
```

---

## 🔗 Access All Portals

| Portal | URL | Features |
|--------|-----|----------|
| **Resident Dashboard** | http://localhost:3000/resident | Stats, docs, notifications, blotter |
| **Resident Login** | http://localhost:3000/resident/login | Mock login with carousel |
| **Resident Documents** | http://localhost:3000/resident/documents | Request documents workflow |
| **Resident Notifications** | http://localhost:3000/resident/notifications | Unread alerts & history |
| **Resident Blotter** | http://localhost:3000/resident/blotter | File incident reports |
| **Official Dashboard** | http://localhost:3000/official | Admin stats & trends |
| **Official Login** | http://localhost:3000/official/login | Admin login |

---

## 📋 What Was Updated

### ✅ Completed
1. **Resident Dashboard** (`/app/resident/page.tsx`)
   - Welcome section
   - Statistics cards
   - Notifications preview
   - Document requests list
   - Blotter reports list
   - Announcements section

2. **Document System** (`/app/resident/documents/page.tsx`)
   - Click document cards to request
   - Updated status labels:
     - "Ready to Release" (approved)
     - "Waiting for Official Approval" (pending)
     - "Rejected - Resubmit" (rejected)

3. **Notifications Page** (`/app/resident/notifications/page.tsx`)
   - Full notification history
   - Filter by type
   - Mark as read/delete
   - Unread indicators

4. **Sidebar Layout** (`/app/resident/layout.tsx`)
   - Fixed left sidebar
   - Circular logo
   - Mobile hamburger menu

5. **Logo Updates**
   - All pages use `/images/santiagologo.jpg` (circular)
   - Background uses `/images/bg.jpg`

---

## 🚀 Build & Deploy

### Local Build
```bash
# Build for production
pnpm build

# Test production build locally
pnpm start

# Run linter
pnpm lint
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

---

## 📊 Key Files

| File | Purpose |
|------|---------|
| `/app/resident/page.tsx` | Resident dashboard (updated) |
| `/app/resident/documents/page.tsx` | Document requests workflow |
| `/app/resident/notifications/page.tsx` | Notifications page (new) |
| `/app/resident/blotter/page.tsx` | Blotter reports |
| `/app/resident/layout.tsx` | Left sidebar layout (fixed) |
| `/app/official/dashboard/page.tsx` | Official dashboard |
| `/SETUP_GUIDE.md` | Complete system documentation |
| `/IMPLEMENTATION_SUMMARY.md` | Detailed feature guide |

---

## 🎨 Available Design Features

### Status Badges
```tsx
<Badge className="bg-emerald-100 text-emerald-700">Ready to Release</Badge>
<Badge className="bg-amber-100 text-amber-700">Waiting for Approval</Badge>
<Badge className="bg-red-100 text-red-700">Rejected - Resubmit</Badge>
```

### Icons (from lucide-react)
- Bell (notifications)
- CheckCircle2 (approved)
- Clock (pending)
- AlertTriangle (alert)
- FileText (documents)
- Users (residents)
- etc.

### Colors
- Primary: `#166534` (Green)
- Success: Emerald
- Warning: Amber
- Error: Red

---

## 🔐 Test Credentials

```
Resident Login:
  Email: resident@example.com
  Password: (any)

Official Login:
  Email: official@example.com
  Password: (any)
```
*Note: Currently mock login - implement actual auth later*

---

## 📝 Mock Data Available

### Documents
- Barangay Clearance (PHP 50)
- Certificate of Residency (PHP 50)
- Certificate of Indigency (Free)
- Certificate of Solo Parent (PHP 50)
- Certificate of Business Closure (PHP 75)
- Barangay Business Clearance (PHP 100)
- Medical Assistance Certificate (Free)

### Notifications
- 5 sample notifications with types: approval, rejection, announcement, update

### Blotter Reports
- 3 sample reports with statuses: filed, processing, resolved

### Documents Trends
- Chart showing document requests over time

---

## 🛠️ Common Issues & Fixes

### Port 3000 Already in Use
```bash
pnpm dev -- -p 3001
```

### Dependencies Not Installed
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
pnpm build
```

### Preview Not Updating
```bash
# Stop dev server (Ctrl+C)
# Restart
pnpm dev
```

---

## 📚 Documentation Files

1. **SETUP_GUIDE.md** - Complete system overview, features, and database schema
2. **IMPLEMENTATION_SUMMARY.md** - Detailed implementation guide with code patterns
3. **QUICK_START.md** - This file (quick reference)

---

## 🎯 Next Steps

### Phase 1: Frontend (Current)
- ✅ Responsive design
- ✅ UI/UX finalization
- ✅ Mock data implementation

### Phase 2: Backend (Next)
- [ ] Set up Supabase/Neon database
- [ ] Implement authentication
- [ ] Create API routes
- [ ] Document auto-generation

### Phase 3: Features (Future)
- [ ] Email notifications
- [ ] PDF generation
- [ ] Admin approval workflow
- [ ] Reporting & analytics
- [ ] Role-based access control

---

## 💡 Tips

1. **Use the sidebar** to navigate between pages
2. **Click document cards** to request (not a button)
3. **Check notifications** for real-time updates
4. **View mock data** while building backend
5. **Test responsive** design (F12 → Toggle device toolbar)

---

## 📞 Need Help?

Check the documentation files:
- Questions about system? → `SETUP_GUIDE.md`
- Implementation details? → `IMPLEMENTATION_SUMMARY.md`
- Quick reference? → This file

---

## ✨ System Status

- **Frontend**: Production Ready ✅
- **Database**: Ready for Connection ⏳
- **Authentication**: Mock Implementation ⏳
- **Backend APIs**: Ready to Implement ⏳
- **Document Generation**: Ready to Implement ⏳

---

**Happy Coding!** 🚀

For Barangay Santiago 100 Years Celebration
System by v0
May 2026
