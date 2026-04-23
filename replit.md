# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **AI**: OpenAI via Replit AI Integrations (gpt-5-mini) — chatbot assistant

## Workflows

- **Start application**: Portal frontend (port 23288, BASE_PATH=/)
- **Start Backend**: API server (port 8080)

## AI Chatbot

- Floating chat bubble on all portal pages (bottom right corner)
- Answers questions about barangay processes, document requirements, registration, blotter
- Backend: `artifacts/api-server/src/routes/openai/` — SSE streaming with conversation persistence
- Frontend: `artifacts/barangay-portal/src/components/chatbot/chatbot.tsx`
- DB tables: `conversations`, `messages` (Drizzle schema in `lib/db/src/schema/`)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
