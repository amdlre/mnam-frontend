# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical: Next.js 16 Breaking Changes

This project uses **Next.js 16.2.3** which has breaking changes from earlier versions. Before writing any Next.js code, consult the bundled documentation at `node_modules/next/dist/docs/` — particularly the `01-app/` section for App Router patterns. Do not rely on prior Next.js knowledge without verifying against these docs.

Key difference: `params` in layouts/pages is a `Promise` and must be awaited (e.g., `const { locale } = await params;`).

## Commands

- **Dev server:** `npm run dev`
- **Build:** `npm run build`
- **Lint:** `npm run lint` (ESLint 9 flat config — next/core-web-vitals + next/typescript + prettier)
- **Lint fix:** `npm run lint:fix`
- **Start production:** `npm run start`

No test framework is currently configured.

## Tech Stack

- Next.js 16.2.3 (App Router), React 19, TypeScript 5 (strict)
- Tailwind CSS 4 — `@import "tailwindcss"` syntax, `@theme inline` in `globals.css`, no `tailwind.config.js`
- `@amdlre/design-system` — local linked package (`file:../../amdlre-design-system`) providing shadcn-based components (`Typography`, `Stack`, `Toaster`, etc.) and theming via `AmdlreProvider`
- `next-intl` v4 for i18n (Arabic/English, Arabic default, `localePrefix: 'always'`)
- Zod v4 + React Hook Form + `@hookform/resolvers` for form validation
- Prettier with `prettier-plugin-tailwindcss`

## Architecture

### Routing & Locale Structure

All routes are locale-prefixed: `/[locale]/...`. The root `src/app/layout.tsx` is a pass-through; the real layout is `src/app/[locale]/layout.tsx` which sets `<html lang dir>`, loads fonts (IBM Plex Sans Arabic), and wraps children in providers.

Route groups:
- `(auth)` — `/login`, `/register`, `/forgot-password`
- `(dashboard)` — `/dashboard`, `/dashboard/settings` (has its own sidebar layout)

The landing page is at `src/app/[locale]/page.tsx`.

### Middleware (`src/middleware.ts`)

Combines `next-intl` locale middleware with auth guards. Unauthenticated users hitting protected routes are redirected to `/[locale]/login`. Authenticated users hitting auth routes are redirected to `/[locale]/dashboard`. Auth is checked via the `access_token` cookie.

### Provider Stack (`src/providers/index.tsx`)

`AmdlreProvider` (design system theming with custom HSL color palette) → `AuthProvider` (client-side auth state via context). Theme colors are defined inline in `providers/index.tsx` using HSL values.

### API Layer

- **Fetcher** (`src/lib/api/fetcher.ts`): Wraps `fetch` with typed responses (`ApiResponse<T>`), automatic Bearer token injection from cookies (server-side only), and an `ApiException` error class. Exports `api.get/post/put/patch/delete` convenience methods.
- **Endpoints** (`src/lib/api/endpoints.ts`): Centralized API path constants.
- **Server Actions** (`src/actions/`): Auth actions (login, register, logout) that validate with Zod, call the API, set httpOnly cookies, and redirect.

### Auth System

- Tokens stored as httpOnly cookies (`access_token`, `refresh_token`) managed in `src/lib/auth/tokens.ts`
- Server-side session helpers in `src/lib/auth/session.ts` (`getCurrentUser`, `isAuthenticated`)
- Client-side auth context in `src/providers/auth-provider.tsx` with `useAuth` hook

### i18n

- Config: `src/i18n/routing.ts` and `src/i18n/request.ts`
- Translation files: `src/messages/ar.json`, `src/messages/en.json`
- Use `useTranslations('namespace')` in client components, `getTranslations('namespace')` in server components
- Default locale is Arabic (`ar`), direction handled automatically (`rtl`/`ltr`)

### Validation

Zod schemas live in `src/lib/validations/`. Validation error messages are in Arabic. Schemas export inferred TypeScript types (e.g., `LoginFormData`).

### Constants

- `src/constants/config.ts` — `APP_CONFIG` object (app name, API URL, i18n, auth cookie names) sourced from env vars
- `src/constants/routes.ts` — Route paths plus `PUBLIC_ROUTES` and `AUTH_ROUTES` arrays used by middleware

### SEO

`src/lib/seo/metadata.ts` exports `generateSiteMetadata(locale, options?)` for per-page Next.js Metadata with OG/Twitter card support and locale alternates.

## Code Style

- ESLint enforces: `consistent-type-imports`, no `any`, import ordering (builtin → external → internal → parent/sibling → index → type with newlines between groups), no `console.log` (warn/error allowed)
- Prettier: single quotes, trailing commas, 100 char width, LF line endings
- Path alias: `@/*` → `./src/*`
- Server Components by default; `"use client"` only when necessary

## Tailwind CSS 4

No `tailwind.config.js`. All theme tokens are in `src/app/globals.css` under `@theme inline`. Design system classes are scanned via `@source '../../node_modules/@amdlre/design-system/dist'`. Custom CSS utilities use the `@utility` directive. Colors use HSL CSS variables set by the design system provider at runtime.
