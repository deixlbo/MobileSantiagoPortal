# Barangay Santiago Admin Portal

Civic web portal for a Philippine barangay (village). Two surfaces:

1. **Public landing** (`/`, `/login`, `/register`, `/documents`) — residents browse announcements, ordinances, and request documents.
2. **Admin portal** (`/admin/*`) — barangay staff manage residents, blotter (incident) reports, projects, announcements, ordinances, document requests, and uploaded assets.

## Architecture

- **Monorepo**: pnpm workspace.
- **Artifacts**:
  - `artifacts/barangay-portal` — React + Vite + Wouter + TanStack Query + Tailwind + shadcn/ui (port 23288).
  - `artifacts/api-server` — Express 5 API at `/api` (port 8080).
  - `artifacts/mockup-sandbox` — Component preview sandbox.
- **Database**: PostgreSQL via Drizzle ORM. Schemas in `lib/db/src/schema/`.
- **API contract**: OpenAPI 3.1 at `lib/api-spec/openapi.yaml`. Codegen produces:
  - React Query hooks → `lib/api-client-react/src/generated/api.ts`
  - Zod validators → `lib/api-zod/src/generated/api.ts`

After editing the OpenAPI spec, run `pnpm --filter @workspace/api-spec run codegen`. After editing schemas in `lib/db/src/schema`, run `pnpm --filter @workspace/db run push`.

## Theming

GREEN civic palette: deep emerald/forest primary on cream/off-white surfaces. Defined in `artifacts/barangay-portal/src/index.css`.

## Domain Entities

- `residents` — resident directory with status (active/pending/inactive)
- `blotter_reports` — incident reports with status (pending/investigating/resolved/dismissed)
- `projects` — barangay projects with budget (PHP) and progress %
- `announcements` — published events / health / meetings / general
- `ordinances` — local ordinances with status (draft/enacted/repealed)
- `document_requests` + `document_categories` — document services (Barangay Clearance, Certificate of Residency, etc.)
- `assets` — uploaded files (image/document/video)

## Auth

Stub admin login: clicking "Continue as Admin" sets `localStorage["isAdmin"] = "true"` and routes to `/admin`. No real authentication.
