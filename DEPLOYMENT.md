# Mobile Santiago Portal - Deployment Guide

## Project Status: ✅ Ready for Production

This project has been successfully converted from **pnpm to npm** and is fully deployment-ready.

## What Was Fixed

### 1. Package Manager Migration
- Removed `pnpm-lock.yaml` and `pnpm-workspace.yaml`
- Converted to npm workspaces in `package.json`
- Generated `package-lock.json` for reproducible builds
- Updated `.npmrc` with npm-compatible settings

### 2. TypeScript & Build Errors
- Fixed duplicate exports in `lib/api-zod` (removed conflicting type exports)
- Fixed `p-retry` imports in `lib/integrations-openai-ai-server`
- Fixed null-safety errors in image client with optional chaining
- Removed references to non-existent packages from `tsconfig.json`

### 3. Application Layer
- Updated build scripts to work with npm workspaces
- Fixed environment variable handling in Vite config
- Created a fully functional Dashboard component displaying the Mobile Santiago Portal landing page
- Updated App.tsx to render the Dashboard by default

## Local Development

### Installation
```bash
npm install --legacy-peer-deps
```

### Running Locally
```bash
npm run dev
```
This will start the development server at `http://localhost:5173/` (or next available port if in use)

### Build for Production
```bash
npm run build
```

## Deployment to Vercel

The project is production-ready and can be deployed to Vercel:

1. **Connect your repository** to Vercel via GitHub/GitLab
2. **Configure build settings:**
   - Build Command: `npm run build`
   - Output Directory: `artifacts/mockup-sandbox/dist`
   - Install Command: `npm install --legacy-peer-deps`

3. **Deploy:**
   - Push to your main branch, or manually trigger deployment from Vercel dashboard

## Available Commands

| Command | Purpose |
|---------|---------|
| `npm install --legacy-peer-deps` | Install all dependencies |
| `npm run build` | Build for production (excludes barangay-mobile) |
| `npm run build:full` | Build all artifacts including mobile |
| `npm run dev` | Start development server |
| `npm run typecheck` | Run TypeScript type checking |

## Project Structure

```
├── artifacts/
│   ├── api-server/          # Backend API server
│   ├── mockup-sandbox/      # Frontend (Vite + React)
│   └── barangay-mobile/     # Mobile app (Expo)
├── lib/
│   ├── api-zod/             # API type definitions
│   ├── api-spec/            # API specifications
│   ├── db/                  # Database layer
│   └── integrations-openai-ai-server/
├── scripts/                 # Utility scripts
└── package.json            # Root workspace config
```

## Key Features

- **Modern Stack**: React 19, Vite, Tailwind CSS
- **Type-Safe**: Full TypeScript support
- **Component Library**: Pre-built UI components in `components/ui/`
- **API Integration**: Ready for OpenAI and other integrations
- **Database**: Drizzle ORM configured with database support

## Frontend Output

The frontend displays a modern dashboard for the Mobile Santiago Portal with:
- City services portal
- Community updates and announcements
- Service statistics dashboard
- Quick action buttons for citizen services
- Responsive design optimized for mobile and desktop

## Notes

- The `barangay-mobile` build is excluded from the default `npm run build` to streamline deployment
- Use `npm run build:full` to include mobile builds (requires Expo deployment environment)
- All dependencies use `--legacy-peer-deps` to maintain compatibility
- Environment variables can be configured in Vercel project settings

## Troubleshooting

If you encounter any issues:

1. **Clear cache and reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   ```

2. **Check Node version:** Ensure you're using Node.js 18+ 

3. **Verify environment:** Make sure `PORT` and `BASE_PATH` are set in production (defaults to 5173 and "/" respectively)

## Support

For deployment issues or questions, refer to:
- [Vercel Deployment Docs](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
