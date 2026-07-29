# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**HongDuCC** — 洪都中学智慧校园平台 (HongDu Middle School Smart Campus Platform, Nanchang). A campus information web app providing news, learning resources, forum/discussion, social feeds, clubs, and admin dashboard for teachers and students.

The repository is being **migrated from a monolithic Vue 3 SPA** (`HongDu/`) to a **pnpm monorepo** with separate frontend (Vue 3 + TS), backend (NestJS + Prisma + MySQL), and shared packages.

## Workspace Layout

```
HongDuCC/
├── HongDu/            # LEGACY: Original monolithic app (standalone, NOT in pnpm workspace)
│                      #   Vue 3 SPA + Python FastAPI backend — fully featured, reference implementation
├── frontend/          # NEW: Vue 3 + TypeScript + Vite 8 SPA (pnpm workspace package)
├── backend/           # NEW: NestJS + Prisma v7 + MySQL API server (pnpm workspace package)
├── packages/shared/   # Shared types/interfaces (@hongducc/shared, consumed by frontend & backend)
├── pnpm-workspace.yaml
└── package.json       # Root: monorepo orchestration scripts only
```

**Important**: The `HongDu/` directory is the legacy app with its own `package.json`, `package-lock.json`, and dependencies. It is **not** managed by pnpm and has its own `CLAUDE.md` documenting its internal architecture. The `frontend/` and `backend/` packages are the new pnpm workspace members being built to replace it.

## Commands

### Monorepo (root)

```bash
pnpm install                    # Install all workspace dependencies
pnpm dev                        # Run frontend + backend dev servers concurrently
pnpm dev:frontend               # Start only the frontend (Vite, default port 5173)
pnpm dev:backend                # Start only the backend (NestJS, default port 3000)
```

### Frontend (`frontend/`)

```bash
pnpm --filter frontend dev      # Vite dev server
pnpm --filter frontend build    # vue-tsc type-check + vite build
pnpm --filter frontend preview  # Preview production build
```

### Backend (`backend/`)

```bash
pnpm --filter backend start:dev     # NestJS in watch mode (port 3000)
pnpm --filter backend build         # nest build
pnpm --filter backend start:prod    # Run built production server
pnpm --filter backend test          # Jest unit tests
pnpm --filter backend test:e2e      # Jest e2e tests
pnpm --filter backend test:cov      # Jest with coverage
```

### Legacy app (`HongDu/`)

```bash
cd HongDu
npm install                    # Uses npm, NOT pnpm
npm run dev                    # Vite dev server (port 5173, proxies /api → localhost:8000)
npm run build                  # Production build to dist/
npm run lint                   # oxlint + eslint (auto-fix)
npm run format                 # Prettier
npm run deploy                 # Deploy to Cloudflare Pages via wrangler

# Backend (Python FastAPI)
cd HongDu/backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## Architecture

### Legacy App (`HongDu/`) — Reference Implementation

The `HongDu/` directory contains the fully-featured, deployed application. When building features in the new monorepo packages, **consult the legacy app** for:
- UI patterns, component design, and page layouts
- API response format (`{ code: 0, message: "...", data: ... }`)
- Auth flow (custom JWT: student ID + password, HS256, 24h expiry, localStorage)
- Database schema (15 tables — users, news, resources, forum, comments, feeds, clubs, notifications, reports, etc.)
- Polymorphic comment system (`target_type` + `target_id`)

See `HongDu/CLAUDE.md` and `HongDu/README.md` for full legacy architecture documentation.

### New Frontend (`frontend/`)

- **Stack**: Vue 3 Composition API (`<script setup lang="ts">`), Vite 8, Naive UI
- **State**: Not yet established — likely Pinia with composable pattern following the legacy app
- **Routing**: Vue Router 4 with `createWebHistory`, routes defined in `src/router/index.ts`
- **Path alias**: `@` → `src/`
- **Auto-import**: Naive UI components via `unplugin-vue-components` (no manual imports needed)
- Currently only has a `Home` route and `TitleBar` component — very early stage

### New Backend (`backend/`)

- **Stack**: NestJS 11, Prisma v7 with MySQL, RxJS
- **Database**: MySQL (`hongducc_db` on localhost:3306), schema at `prisma/schema.prisma`
- **Prisma client**: Generated to `generated/prisma/` (custom output path)
- Currently only has NestJS scaffolding (`AppModule`, `AppController`, `AppService`) — very early stage

### Shared Package (`packages/shared/`)

- `@hongducc/shared` — workspace package consumed by both `frontend` and `backend`
- Currently exports a `User` interface (`ID`, `UserName`, `TrueName`)

### API Convention (inherited from legacy)

All API endpoints return: `{ code: 0, message: "...", data: ... }` where `code: 0` indicates success.

## Key Patterns (from legacy, expected to carry forward)

- **Stores are composables**: Each store is a function (`useXxxStore()`) returning reactive refs/methods, using module-level reactive refs for singleton state — not `defineStore`.
- **API modules**: Each `api/xxx.js` exports plain async functions, no class wrappers.
- **Auth**: Custom JWT stored in `localStorage` under keys `token` and `user`. Router guards check `requiresAuth` and `requiresAdmin` meta fields.
- **Comment system**: Polymorphic via `target_type` + `target_id`, supporting nested replies through `parent_id`.
- **Admin route**: `/admin` uses a layout wrapper; `TitleBar`/`FooterBar` hidden on admin pages.

## Environment Variables

- `backend/.env`: `DATABASE_URL` — MySQL connection string for Prisma
- Legacy `HongDu/.env`: `VITE_CLERK_PUBLISHABLE_KEY` (reserved, not actively used)
