# 🔐 Fix: Invalid API Key - Getting Real Supabase Credentials

## Problem
The JWT tokens in `.env.local` are placeholders and don't work with your Supabase project.  
**Error:** "Invalid API key" when trying to access Supabase

## ✅ Solution: Get Your Real API Keys

### Step 1: Sign in to Supabase Dashboard
1. Visit: **https://app.supabase.com**
2. Sign in with your credentials (Google, GitHub, or email)

### Step 2: Locate Your Project
- You should see a project with reference: `lwgrttftxckcvtheuoud`
- Click on it to open the project

### Step 3: Navigate to API Settings
1. In the left sidebar, click **Settings** (gear icon)
2. Click **API** in the submenu
3. You'll see a section called "Project API keys"

### Step 4: Copy Your Keys

You'll see three keys displayed:

#### **anon public** (publicly safe to expose)
- Label: "anon (public)"
- Copy this value
- Paste into `.env.local` as: `NEXT_PUBLIC_SUPABASE_ANON_KEY=`

#### **service_role** (SENSITIVE - never expose)
- Label: "service_role (secret)"
- Copy this value  
- Paste into `.env.local` as: `SUPABASE_SERVICE_ROLE_KEY=`

#### **Project URL** (already configured)
- Should be: `https://lwgrttftxckcvtheuoud.supabase.co`
- This is already set in `.env.local`

### Step 5: Update `.env.local`

Open `.env.local` and replace:

```env
NEXT_PUBLIC_SUPABASE_URL=https://lwgrttftxckcvtheuoud.supabase.co

# Paste your anon public key here (from Supabase Settings > API)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Paste your service role key here (from Supabase Settings > API)  
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 6: Restart Your Dev Server
```bash
# Stop the current dev server (Ctrl+C)
npm run dev
```

The "Invalid API key" error should be resolved!

---

## 📋 Verification Checklist

- [ ] You have accessed https://app.supabase.com
- [ ] You found your project: `lwgrttftxckcvtheuoud`
- [ ] You navigated to Settings > API
- [ ] You copied the **anon (public)** key
- [ ] You copied the **service_role (secret)** key
- [ ] You updated `.env.local` with the real keys
- [ ] You restarted the development server
- [ ] API calls now work without "Invalid API key" error

---

## 🔒 Security Important Notes

### What's Safe to Expose ✅
- `NEXT_PUBLIC_SUPABASE_URL` - Public project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon key (limited permissions)

### What's SENSITIVE - Never Expose ⚠️
- `SUPABASE_SERVICE_ROLE_KEY` - Has full admin access
- NEVER commit `.env.local` to Git
- `.env.local` is in `.gitignore` (protected)

---

## 🆘 Troubleshooting

### "Still getting Invalid API key"
1. ✅ Double-check you copied the keys exactly (no extra spaces)
2. ✅ Verify the keys are from the correct Supabase project
3. ✅ Make sure you restarted the dev server after updating `.env.local`
4. ✅ Check if the keys have expired (regenerate if needed in Supabase)

### "Can't find the API keys"
1. Make sure you're in the correct project in Supabase
2. Look for **Settings > API** in the left sidebar
3. If you don't see keys, your account may not have permission - contact project admin

### How to Regenerate Keys (if needed)
In Supabase Settings > API:
1. Find the key you want to regenerate
2. Click the **Rotate** button next to it
3. Confirm the action
4. Copy the new key and update `.env.local`

---

## 📝 Current Status
- `.env.local` created ✓
- Build configuration verified ✓
- **PENDING:** Add actual Supabase API keys
