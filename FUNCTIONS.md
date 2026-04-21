# Mobile Santiago Portal - Process Functions Documentation

## Project Structure
The project is a mobile city portal application with a component preview system. It consists of:
- Dashboard Page (main landing page)
- App Router System (component preview navigation)
- Main Entry Point (React rendering)

---

## Page 1: Dashboard Component
**File:** `artifacts/mockup-sandbox/src/components/mockups/Dashboard.tsx`

### Purpose
The Dashboard is the main landing page that displays the Mobile Santiago Portal with city services, statistics, announcements, and action buttons.

### Functions and Processes

#### 1. Dashboard() - Main Component Function
**Type:** React Functional Component
**Purpose:** Returns the complete dashboard UI structure with all sections
**Process Flow:**
- Creates the main container with min-h-screen background color (slate-50)
- Renders the header with logo, title, and notification bell
- Renders main content area with:
  - Welcome section (gradient banner)
  - Quick statistics grid (4 cards showing: Active Services, Pending Requests, Community Events, Residents)
  - Featured sections grid (City Services list, Latest Updates announcements)
  - Action buttons section (Access Services, Learn More buttons)
  - Footer with links and information
- Uses Tailwind CSS classes for responsive design (mobile-first with md: breakpoints)
- Returns JSX that renders the complete page structure

**Key Elements Rendered:**
- Header: Location icon + Title + Notification button with red indicator
- Stats Cards: Four stat cards with icons (FileText, AlertCircle, Calendar, Users) showing metrics
- Services List: Four clickable service options (License & Permits, Bill Payment, Request Support, Report Issue)
- Announcements: Three announcement items with different border colors
- Action Buttons: Two button styles (primary blue, secondary outlined)
- Footer: Four columns with links (About, Services, Legal, Follow) + copyright text

**No State Management:** This component is purely presentational and renders static content without useState or useEffect hooks

---

## Page 2: App Component (Router)
**File:** `artifacts/mockup-sandbox/src/App.tsx`

### Purpose
The App component manages the routing logic between the Dashboard gallery view and individual component preview pages. It dynamically loads components based on URL paths.

### Functions and Processes

#### 1. _resolveComponent(mod, name) - Component Resolution
**Type:** Helper Function
**Purpose:** Extracts the correct React component export from a dynamically loaded module
**Process Flow:**
- Takes a module object and component name as parameters
- Filters all values in the module to find function exports
- Returns component in priority order:
  1. mod.default (default export)
  2. mod.Preview (Preview-named export)
  3. mod[name] (component with matching name)
  4. Last function in the module (fallback)
- Returns undefined if no component found
**Used By:** PreviewRenderer component

#### 2. PreviewRenderer({componentPath, modules}) - Dynamic Component Loader
**Type:** React Functional Component
**Purpose:** Dynamically loads and renders any component based on the componentPath prop
**Process Flow:**
- Accepts componentPath (string) and modules (module map) as props
- Uses useState to manage: Component (loaded component), error (error message)
- Uses useEffect with dependency array [componentPath, modules]
- Inside useEffect:
  - Sets Component and error to null (reset state)
  - Builds module key: `./components/mockups/${componentPath}.tsx`
  - Checks if loader exists for that key
  - If not found, sets error message
  - If found, dynamically imports the module using loader()
  - Calls _resolveComponent to extract the actual component
  - Sets Component state with the resolved component
  - Catches any errors during loading and sets error state
  - Handles cleanup with cancelled flag (prevents memory leaks)
- Renders either error message (red text), loading state (null), or the loaded Component
**State Management:**
- Component: null initially, becomes the loaded React component
- error: null initially, becomes error message string if loading fails

#### 3. getBasePath() - Environment Path Helper
**Type:** Utility Function
**Purpose:** Returns the base URL path from Vite's environment configuration
**Process Flow:**
- Gets import.meta.env.BASE_URL from Vite environment
- Removes trailing slash using .replace(/\/$/, "")
- Returns the cleaned base path string
**Used By:** getPreviewExamplePath() and getPreviewPath()

#### 4. getPreviewExamplePath() - Example Path Builder
**Type:** Utility Function
**Purpose:** Constructs an example preview URL path for documentation
**Process Flow:**
- Calls getBasePath() to get the base URL
- Concatenates: basePath + "/preview/ComponentName"
- Returns the example URL string
**Used By:** Not currently used (was for Gallery fallback message)

#### 5. Gallery() - Home Page Component
**Type:** React Component
**Purpose:** Renders the home gallery page (when user visits root path)
**Process Flow:**
- Returns PreviewRenderer component with:
  - componentPath="Dashboard" (loads the Dashboard component)
  - modules={discoveredModules} (passes available modules)
- This displays the Dashboard when no preview path is specified
**Used By:** App component

#### 6. getPreviewPath() - URL Path Parser
**Type:** Utility Function
**Purpose:** Extracts the component name from the current URL path
**Process Flow:**
- Gets current window.location.pathname
- Gets basePath using getBasePath()
- Checks if pathname starts with basePath and removes it if true
- Uses regex pattern match: /^\/preview\/(.+)$/
- Returns the captured component name from URL (everything after /preview/)
- Returns null if pattern doesn't match (means user is on home page)
**Used By:** App component to determine which component to preview

#### 7. App() - Main Router Component
**Type:** React Functional Component
**Purpose:** Main application router that switches between home gallery and component previews
**Process Flow:**
- Calls getPreviewPath() to get current preview path from URL
- Conditional rendering:
  - IF previewPath exists (user visiting /preview/ComponentName):
    - Renders PreviewRenderer with the previewPath
    - Shows the specific component being previewed
  - ELSE (user visiting root path /):
    - Renders Gallery component
    - Shows the Dashboard home page
- Acts as the main routing logic for the application
**No State Management:** Uses URL-based routing instead of internal state

---

## Page 3: Main Entry Point
**File:** `artifacts/mockup-sandbox/src/main.tsx`

### Purpose
The entry point that initializes the React application and mounts it to the DOM.

### Functions and Processes

#### 1. React Root Setup
**Type:** Application Initialization
**Purpose:** Creates and renders the React application on page load
**Process Flow:**
- Imports createRoot from 'react-dom/client'
- Imports App component (main router)
- Imports global styles from './index.css'
- Finds DOM element with id="root" in index.html
- Creates React root using createRoot() with the root element
- Renders the App component into the root
- This starts the entire application
**Execution:** Runs once when the page loads

---

## Function Call Flow Summary

### When User Visits Root Path (/)
1. main.tsx initializes React and renders App component
2. App calls getPreviewPath() → returns null (not a preview URL)
3. App renders Gallery component
4. Gallery renders PreviewRenderer with componentPath="Dashboard"
5. PreviewRenderer loads Dashboard.tsx dynamically
6. Dashboard component renders the home page

### When User Visits /preview/SomeComponent
1. main.tsx initializes React and renders App component
2. App calls getPreviewPath() → returns "SomeComponent" (parsed from URL)
3. App renders PreviewRenderer with componentPath="SomeComponent"
4. PreviewRenderer loads the SomeComponent.tsx file dynamically
5. Component is resolved and rendered

---

## State Management Overview

### Component State
- **App.tsx:** Uses URL-based routing (no state)
- **PreviewRenderer.tsx:** Uses useState for Component and error
- **Dashboard.tsx:** Pure presentational component (no state)

### Props Flow
- App → Gallery → PreviewRenderer (passes modules)
- App → PreviewRenderer → (directly loads components)
- PreviewRenderer → Resolved Component (rendered as child)

---

## Module System
- discoveredModules: Map of all available components from .generated/mockup-components.ts
- Module keys format: ./components/mockups/ComponentName.tsx
- Dynamic import system allows runtime component loading without static imports
