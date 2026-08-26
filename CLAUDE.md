# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**HongDuCC** — 洪都中学智慧校园平台 (HongDu Middle School Smart Campus Platform, Nanchang). A campus information web app providing news, learning resources, social feeds, clubs, and admin dashboard for teachers and students.

The repository is being **migrated from a monolithic Vue 3 SPA** (`OLD_PRT/`) to a **pnpm monorepo** with separate frontend (Vue 3 + TS), backend (NestJS + Prisma + PostgreSQL), and shared packages.

**Migration status**: Stage 1/3 complete — new frontend (all pages + auth + API layer) and new backend (all business modules + auth + Prisma schema) are built and committed. The campus forum feature was removed in Aug 2025 (frontend pages/routes, backend `forum` module, and DB tables `forum_posts`/`forum_likes`). Remaining work: admin dashboard flesh-out, shared-package types, docs alignment, deployment.

## Workspace Layout

```
HongDuCC/
├── OLD_PRT/           # LEGACY: Original monolithic app (standalone, NOT in pnpm workspace)
│                      #   Vue 3 SPA + Python FastAPI backend — fully featured, reference implementation
├── frontend/          # NEW: Vue 3 + TypeScript + Vite 8 + Naive UI SPA (pnpm workspace package)
├── backend/           # NEW: NestJS 11 + Prisma v7 + PostgreSQL API server (pnpm workspace package)
├── packages/shared/   # Shared types/interfaces (@hongducc/shared, consumed by frontend & backend)
├── pnpm-workspace.yaml
└── package.json       # Root: monorepo orchestration scripts only
```

**Important**:
- `OLD_PRT/` is the legacy app (its on-disk name; docs/commits may still reference it as `HongDu/`). It has its own `package.json`, `package-lock.json`, and `CLAUDE.md` documenting its internal architecture. It is **not** managed by pnpm.
- `OLD_PRT/` is tracked by the root repo as a **gitlink** (nested git repository, commit `4242147`) but is **not registered as a git submodule** (no `.gitmodules`). A fresh clone will leave that directory empty; it must be fetched separately.
- The `frontend/` and `backend/` packages are the new pnpm workspace members being built to replace the legacy app.

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
pnpm --filter frontend dev      # Vite dev server (port 5173, proxies /api → localhost:3000)
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

# Prisma CLI (no wrapper script in backend/package.json — use exec)
pnpm --filter backend exec prisma generate   # Regenerate client into generated/prisma/
pnpm --filter backend exec prisma migrate dev   # Apply schema migrations to the database
```

### Legacy app (`OLD_PRT/`)

```bash
cd OLD_PRT
npm install                    # Uses npm, NOT pnpm
npm run dev                    # Vite dev server (port 5173, proxies /api → localhost:8000)
npm run build                  # Production build to dist/
npm run lint                   # oxlint + eslint (auto-fix)
npm run format                 # Prettier
npm run deploy                 # Deploy to Cloudflare Pages via wrangler

# Backend (Python FastAPI)
cd OLD_PRT/backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## Architecture

### Legacy App (`OLD_PRT/`) — Reference Implementation

The `OLD_PRT/` directory contains the fully-featured, deployed application. When building features in the new monorepo packages, **consult the legacy app** for:
- UI patterns, component design, and page layouts
- API response format (`{ code: 0, message: "...", data: ... }`)
- Auth flow (student ID + password, custom JWT, localStorage)
- Database schema (users, news, resources, forum, comments, feeds, clubs, notifications, reports, etc.)
- Polymorphic comment system (`target_type` + `target_id`)

See `OLD_PRT/CLAUDE.md` and `OLD_PRT/README.md` for full legacy architecture documentation.

### New Frontend (`frontend/`)

- **Stack**: Vue 3 Composition API (`<script setup lang="ts">`), Vite 8, Naive UI, Pinia (setup stores), Vue Router 4
- **State**: Pinia with setup-store pattern (`defineStore('auth', () => {...})`); currently one store, `src/stores/auth.ts`
- **Theme system**: `src/theme/index.ts` centralizes color palettes as `ThemeTokens` (bg/card/text/brand colors + gradient), registered in `themes` map (`dark` = 洪都蓝紫 matching the auth page, `light`). `useTheme` (composable) switches themes, injects `--theme-*` CSS variables globally, and provides naive-ui `themeOverrides`. Pages reference `var(--theme-*)`; adding a new theme = registering one entry in `themes`. The navbar `TitleBar` has a sun/moon toggle button for light/dark switching, and all pages (incl. the Auth page) follow the theme
- **Routing**: `createWebHistory`, routes in `src/router/index.ts` — 13 routes incl. `/news/:id`, `/clubs/:id`, `/profile`, `/notifications`, `/admin`, and catch-all 404. Guards use `requiresAuth` and `requiresAdmin` route meta
- **Path alias**: `@` → `src/`
- **Auto-import**: Naive UI components via `unplugin-vue-components` (no manual imports needed)
- **API layer**: `src/api/client.ts` (axios instance — injects Bearer token, unwraps `{ code, message, data }`, redirects to `/login` on 401) plus `auth.ts`, `news.ts`, `resources.ts`, `comments.ts`
- **Layout**: `App.vue` renders a global `TitleBar.vue` above the routed view; dark/light theme via `composables/useTheme.ts`
- **Reusable components**: `SideRays.vue` (WebGL side-ray light background, uses `ogl` — ported from vue-bits) used behind the Clubs hero cover wall; `ColorBends.vue` (three.js shader animated color bands — ported from vue-bits, lazy-loaded) used as full-screen background on the auth page; `StarBorder.vue` (animated flowing glow border button — ported from vue-bits) used for the auth submit buttons, the navbar register button, and the clubs page CTA button; `GradualBlur.vue` (layered gradient blur fade, ported from vue-bits) used at the clubs hero/content junction
- **Clubs hero**: auto-scrolling club cover wall (GridMotion-style rotated rows, sorted by member count, hover shows the club name; random picsum images as placeholder when no club data), with a GradualBlur fade into the content below
- **Auth page**: `views/auth/Auth.vue` merges login + register in one page with a tab switcher (routes `/login` and `/register` both render it, `props.mode` picks the initial tab); dark glassmorphism card over the ColorBends background
- Views: Home, News, NewsDetail, Resources, About, Clubs, Profile, Notifications, Admin, Auth, NotFound — News/Resources/About/Clubs share a dark glassmorphism design (fixed dark backgrounds `#0a101c`/`#08111e`, glass cards); Auth page is dark glassmorphism over the ColorBends background

### New Backend (`backend/`)

- **Stack**: NestJS 11, Prisma v7 (driver adapter `@prisma/adapter-pg`, generated client at `generated/prisma/`), PostgreSQL, RxJS
- **Database**: PostgreSQL (`hongducc_db` on localhost:5432), schema at `prisma/schema.prisma` — 13 models: User, Notification, Resource (+ResourceLike), News, Comment (polymorphic + nested replies), Feed (+FeedLike), Follow, Club (+ClubMember, ClubEvent), Report
- **Auth**: JWT (passport-jwt, Bearer header, secret from `JWT_SECRET` env), bcrypt password hashing, payload `{ sub, sid, role }`. Global `JwtAuthGuard` with `@Public()` decorator for open endpoints; admin-only endpoints combine `@UseGuards(JwtAuthGuard, AdminGuard)` (used in admin, news write, and reports controllers)
- **Global middleware**: `ResponseInterceptor` wraps all success responses as `{ code: 0, message, data }`; `AllExceptionsFilter` wraps errors as `{ code, message, data: null }`; `ValidationPipe` (whitelist + transform) on DTOs
- **Modules** (11): auth, users, news, resources, comments, feeds, social, clubs, notifications, reports, admin
- **Clubs API**: `GET /api/clubs` (paginated, optional `category`), `GET /api/clubs/:id`, `GET /api/clubs/:id/events`, and `GET /api/clubs/events/recent` (global recent events across clubs, for sidebar widgets)
- Bootstrap (`main.ts`): CORS for `localhost:5173`, forces `application/json; charset=utf-8`, listens on `PORT` (default 3000)

### Shared Package (`packages/shared/`)

- `@hongducc/shared` — workspace package consumed by both `frontend` and `backend`
- Currently only exports a `User` interface (`ID`, `UserName`, `TrueName`) — **thin; migrating shared types into it is pending work**

### API Convention (inherited from legacy)

All API endpoints return: `{ code: 0, message: "...", data: ... }` where `code: 0` indicates success. Errors return the HTTP status as `code` with a human-readable `message` and `data: null`.

## Key Patterns

- **Frontend state**: Pinia setup stores (`defineStore`), not the legacy module-level composable pattern
- **API modules**: `src/api/xxx.ts` exports plain async functions using the shared axios `client`, no class wrappers
- **Auth**: JWT stored in `localStorage` under keys `token` and `user`. Router guards check `requiresAuth` and `requiresAdmin` meta fields. Backend enforces JWT globally via `JwtAuthGuard` unless the endpoint is marked `@Public()`
- **Comment system**: Polymorphic via `target_type` + `target_id`, supporting nested replies through `parent_id` (same as legacy)
- **Admin route**: `/admin` guarded by `requiresAuth` + `requiresAdmin` meta (role `'admin'`); the shared `TitleBar` remains visible (unlike the legacy layout-wrapper approach)

## Environment Variables

- `backend/.env`: `DATABASE_URL` — PostgreSQL connection string (`postgresql://user:pass@localhost:5432/hongducc_db`); `JWT_SECRET` optional (falls back to a default secret — change in production)
- Legacy `OLD_PRT/.env`: `VITE_CLERK_PUBLISHABLE_KEY` (reserved, not actively used)
