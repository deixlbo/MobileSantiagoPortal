# Barangay Santiago Portal - Next.js Web App

A modern web portal for Barangay Santiago residents and officials built with Next.js 15, TypeScript, and React.

## Project Structure

```
barangay-mobile/
├── app/
│   ├── login/                    # Public login page
│   ├── (resident)/              # Resident-only routes (protected)
│   │   ├── dashboard/           # Resident dashboard
│   │   ├── announcements/       # View announcements
│   │   ├── documents/           # Request documents
│   │   ├── blotter/             # View incidents
│   │   └── profile/             # User profile
│   ├── (official)/              # Official-only routes (protected)
│   │   ├── dashboard/           # Admin dashboard
│   │   ├── residents/           # Manage residents
│   │   ├── announcements/       # Create announcements
│   │   ├── documents/           # Process documents
│   │   ├── blotter/             # Manage blotter
│   │   └── profile/             # Official profile
│   ├── api/
│   │   ├── auth/                # Authentication endpoints
│   │   ├── documents/           # Document CRUD operations
│   │   ├── announcements/       # Announcement management
│   │   └── residents/           # Resident management
│   ├── layout.tsx               # Root layout with providers
│   ├── globals.css              # Global styles
│   └── page.tsx                 # Root page (redirects)
│
├── components/
│   └── layout/
│       ├── Sidebar.tsx          # Navigation sidebar
│       └── sidebar.module.css   # Sidebar styles
│
├── lib/
│   ├── types/
│   │   └── index.ts            # TypeScript types and interfaces
│   ├── context/
│   │   ├── AuthContext.tsx      # Authentication state management
│   │   └── ThemeContext.tsx     # Theme and color management
│   ├── hooks/
│   │   └── useApi.ts            # API request hook
│   └── utils/
│       └── formatters.ts        # Utility functions
│
├── public/                       # Static assets
├── next.config.js               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

## Role-Based Access

### Resident Pages
- **Dashboard**: Overview with statistics and recent announcements
- **Announcements**: View all barangay announcements
- **Documents**: Request and track document applications
- **Blotter**: View incident reports
- **Profile**: Personal information

### Official Pages
- **Dashboard**: Admin overview with key metrics
- **Residents**: Manage resident database
- **Announcements**: Create and manage announcements
- **Documents**: Process document requests
- **Blotter**: Manage incident reports and investigations
- **Profile**: Official information

## Features

- ✅ Role-based authentication (Resident vs Official)
- ✅ Protected routes with auto-redirect
- ✅ Dark/Light theme support
- ✅ Responsive design (desktop, tablet, mobile)
- ✅ Mock data for demo purposes
- ✅ TypeScript for type safety
- ✅ React Context for state management
- ✅ API routes for backend integration

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

```bash
cd barangay-mobile
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials

**Resident:**
- Email: juan@email.com
- Password: password (4+ chars)

**Official:**
- Email: captain@brgy-santiago.gov.ph
- Password: password (4+ chars)

### Building for Production

```bash
pnpm build
pnpm start
```

## API Routes

### Authentication
- `POST /api/auth/login` - User login

### Documents
- `GET /api/documents` - Fetch documents
- `POST /api/documents` - Request document

### Announcements
- `GET /api/announcements` - Fetch announcements
- `POST /api/announcements` - Create announcement (officials only)

### Residents
- `GET /api/residents` - Fetch residents (officials only)
- `POST /api/residents` - Register resident

## Next Steps

1. **Database Integration**: Connect to a real database (PostgreSQL, MongoDB, etc.)
2. **Authentication**: Implement proper JWT/session authentication
3. **API Implementation**: Replace mock data with actual CRUD operations
4. **UI Enhancements**: Implement full page components with forms and lists
5. **Error Handling**: Add comprehensive error handling and validation
6. **Testing**: Add unit and integration tests
7. **Deployment**: Deploy to Vercel or other hosting platforms

## Technologies Used

- **Frontend**: React 19, Next.js 15, TypeScript
- **Styling**: CSS Modules, CSS Variables
- **State Management**: React Context
- **Data Fetching**: React Query, Fetch API
- **Validation**: Zod (configured, ready to use)

## License

MIT License - Feel free to use this project for your barangay!
