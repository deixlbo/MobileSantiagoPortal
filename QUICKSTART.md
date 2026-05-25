# 🚀 QUICK START COMMANDS

## One-Line Setup (Windows PowerShell)

```powershell
cd c:\Users\Axl\ denielle\Downloads\sazwebtry1; pnpm install; pnpm dev
```

Or with npm:
```powershell
cd c:\Users\Axl\ denielle\Downloads\sazwebtry1; npm install; npm run dev
```

## Step-by-Step Setup

### Step 1: Navigate to Project
```bash
cd c:\Users\Axl\ denielle\Downloads\sazwebtry1
```

### Step 2: Install Dependencies
```bash
pnpm install
```

Or if using npm:
```bash
npm install
```

### Step 3: Start Development Server
```bash
pnpm dev
```

Or with npm:
```bash
npm run dev
```

### Step 4: Open in Browser
```
http://localhost:3000
```

---

## 🌐 Access the System

### Admin Portal
- **URL**: `http://localhost:3000/official`
- **Dashboard**: `http://localhost:3000/official/dashboard`
- **Documents**: `http://localhost:3000/official/documents`
- **Residents**: `http://localhost:3000/official/residents`
- **Blotters**: `http://localhost:3000/official/blotters`
- **Announcements**: `http://localhost:3000/official/announcements`

### Resident Portal
- **URL**: `http://localhost:3000/resident`
- **Dashboard**: `http://localhost:3000/resident/dashboard`
- **Announcements**: `http://localhost:3000/resident/announcements`
- **Blotter**: `http://localhost:3000/resident/blotter`

---

## 📋 What's Working

✅ Admin Dashboard with stats, trends, and alerts
✅ Document Generation (10 document types)
✅ Automatic document filling (name, address, date, control #)
✅ Residents Management with verification system
✅ Blotter Reports with status tracking
✅ Announcements system with real-time notifications
✅ Notification center with unread counter
✅ Role-based access control
✅ Complete API backend
✅ Resident dashboard with quick request button
✅ Personal history of requests
✅ Responsive design for mobile/tablet

---

## 🧪 Test the Features

### Test 1: Admin Dashboard
1. Go to `http://localhost:3000/official/dashboard`
2. View statistics and activity
3. See alerts about pending items

### Test 2: Document Auto-Generation
1. Go to `http://localhost:3000/official/documents`
2. Click "Approve" on pending request
3. Fill O.R. number (optional)
4. Click "Generate & Approve"
5. Document is created with auto-filled data
6. Download the document

### Test 3: Resident Verification
1. Go to `http://localhost:3000/official/residents`
2. Filter by "Pending" status
3. Click "Verify" button
4. Select "Verify Account"
5. Status changes to "Verified"

### Test 4: Submit Document Request
1. Go to `http://localhost:3000/resident/dashboard`
2. Select document type
3. Enter purpose
4. Click "Submit Request"
5. Check admin dashboard - request appears immediately

### Test 5: Post Announcement
1. Go to `http://localhost:3000/official/announcements`
2. Create new announcement
3. Set audience
4. Publish
5. Go to resident dashboard - see announcement

---

## ⚙️ Available Scripts

```bash
# Development
pnpm dev              # Start dev server on port 3000

# Production
pnpm build            # Build for production
pnpm start            # Start production server

# Linting
pnpm lint             # Run ESLint
```

---

## 📦 Dependencies

- **Next.js 15+**: React framework
- **Tailwind CSS**: Styling
- **Shadcn UI**: Component library
- **Framer Motion**: Animations
- **Lucide Icons**: Icon set
- **Recharts**: Charts & graphs

---

## 🔧 Troubleshooting

### Port 3000 Already in Use
```bash
# Kill the process on port 3000
npx kill-port 3000

# Then run dev again
pnpm dev
```

### Dependencies Issue
```bash
# Clear cache and reinstall
pnpm store prune
rm -r node_modules pnpm-lock.yaml
pnpm install
```

### Build Errors
```bash
# Clear next cache
rm -r .next

# Rebuild
pnpm build
```

---

## 📞 Support

For issues or questions, check `IMPLEMENTATION_GUIDE.md` for detailed documentation.

---

**Status**: ✅ Ready to Run  
**Last Updated**: May 3, 2026
