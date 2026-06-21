# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> This is the **frontend** of the VetHealth project. A higher-level monorepo overview covering
> both `backend/` and `frontend/` lives in `../CLAUDE.md`. This file goes deeper on the frontend only.

## What this is

Next.js 16 (App Router, React 19, Turbopack) app serving both a **public content site** and an
authenticated **admin CMS**. It is a thin client over the NestJS backend (`../backend`) — no data
layer of its own, just a typed `fetch` wrapper. Package manager is **pnpm**.

## Commands

```bash
pnpm dev                 # next dev --turbopack → http://localhost:3000
pnpm build               # next build --turbopack (next.config.js: output "standalone")
pnpm test                # jest + Testing Library (jsdom), runs with --coverage
pnpm test:w              # jest --watch
pnpm test -- home        # run a single test file by name/path pattern
pnpm lint                # oxlint --fix   (Oxc; replaced the broken `next lint`)
pnpm type-check          # tsc --noEmit
pnpm format              # oxfmt          (Prettier-compatible; 0.x beta — pin version)
pnpm analyze             # ANALYZE=true next build --webpack (bundle report → .next/analyze/*.html)
```

**Bundle analysis gotcha:** `@next/bundle-analyzer` is a **webpack** plugin, but Next 16's
`next build` defaults to **Turbopack** (and `pnpm build` passes `--turbopack` explicitly), where the
plugin never fires — the build silently prints *"pass the `--webpack` flag"* and emits **no report and
no per-route size columns**. The `analyze` script therefore forces `--webpack`. `next.config.js` wraps
the config with `withBundleAnalyzer({ enabled: process.env.ANALYZE === "true" })`. To map a route to
its client chunks (sizes aren't printed by `next build` in 16), parse
`.next/server/app/<route>/page_client-reference-manifest.js` (lists `static/chunks/*.js`) against the
`window.chartData` JSON embedded in `.next/analyze/client.html`. Heavy editor/admin libs (Lexical,
Recharts, react-select, TanStack, html-react-parser) are correctly code-split **out** of the public
bundle — keep them that way; don't import admin/editor components into `(public)` client components.

Tests live in `__test__/` (currently sparse). Husky runs `lint-staged` on commit
(`oxlint --fix` + `oxfmt` + `type-check`), commitlint on the message, and lint-staged again
on pre-push.

**Lint/format is Oxc** (`.oxlintrc.json` + `.oxfmtrc.json`) — ESLint/Prettier/Biome all removed.
React/Next config that must stay: `react/react-in-jsx-scope: off` (Next 16 automatic JSX runtime),
`no-underscore-dangle`/`import/no-unassigned-import` off, no `jsx-a11y` plugin (future opt-in).
Both tools ignore the vendored Lexical editor dir; oxfmt skips `**/*.css`. No Tailwind class sorting
anymore (`prettier-plugin-tailwindcss` gone). Style: **tabs + double quotes**. Prefix unused with `_`.

## Architecture

### Route groups (`src/app`)
- `(public)/` — public site. `[topic]/page.tsx` and `[topic]/[...slug]/page.tsx` are the dynamic
  content catch-alls, rendered via ISR (cached fetches). `search/`, `privacy-policy/`, home.
- `(dashboard)/admin/` — authenticated CMS for categories, pages, posts, topics, users. The
  `admin/layout.tsx` is the **auth gate**: it calls `auth()` and, if there's no session, signs out
  and redirects to `/api/auth/signin`. Every admin page is a child of this guarded layout.
- `auth/` — login / confirmation / forgot-password flows.
- `api/auth/[...nextauth]/route.ts` — the only API route (NextAuth handler).

### API client (`src/api`) — the most important subsystem
- `routes.ts` builds endpoint URLs from `NEXT_PUBLIC_API_SERVER` || `API_SERVER`, and **throws at
  import time if neither is set**.
- `request.ts` exposes `get` / `post` / `remove` / `sendFile`. Critical behaviors:
  - **Caching is decided by auth**: unauthenticated `get` uses `cache: "force-cache"` plus Next
    `{ next: { tags, revalidate } }` (ISR). Any request with a `token`, or `revalidate: false`,
    uses `cache: "no-store"`. Don't pass a token to data you want cached.
  - `get` **never throws** — it catches everything and returns `null` on error or non-OK. Callers
    must null-check. `post` / `remove` / `sendFile` **do throw** on non-OK.
  - All `post` requests hardcode `x-lang: "ua"` (the backend resolves i18n from this header).
- `index.ts` exposes the typed `api.*` facade (`api.posts.getMany`, `api.auth.login`, …) consumed
  by Server Components and server actions. `api.search` short-circuits to `null` for queries under
  3 chars. Types live in `src/api/types/*`.

### Auth (`src/lib/next-auth`)
- NextAuth v4, single **Credentials** provider that calls `api.auth.login` against the backend.
- The `jwt` callback stores the backend access/refresh tokens and **auto-refreshes** via
  `api.auth.refresh` once `token.tokenExpires` passes. The `session` callback exposes the backend
  bearer as `session.token`.
- Use the `auth()` helper (`auth.ts`, wraps `getServerSession`) in Server Components / actions to
  get the session and `session.token` for authenticated backend calls. Session type augmentation is
  in `types/next-auth.d.ts`.

### Server actions (`actions/` dirs colocated with routes)
Mutations live in `*.action.ts` files marked `"use server"`, colocated under each route
(e.g. `admin/posts/actions/save-post.action.ts`, `auth/actions/login.action.ts`). Conventions:
- Shaped for `useActionState`: `(state, formData) => { error, success, message, redirect? }`.
- Read the session via `auth()`, send the bearer token, then `revalidateTag(...)` to invalidate the
  ISR cache for the affected resource.
- Backend error strings are matched against `utils/constants/server-error-responses` and remapped to
  user-facing Ukrainian messages in `utils/constants/messages`.

### Logging (`src/logger`)
Winston, **server-only**. It's dynamically imported behind `typeof window === "undefined"` guards
(see `request.ts`) so it never reaches the client bundle. Writes to `logs/` and console.

## Conventions

From `.cursor/rules/nextjs-rules.mdc` and the existing code:
- **RSC-first.** Minimize `'use client'`, `useEffect`, `setState`. Do data fetching in Server
  Components / server actions, never the client. Wrap client components in `Suspense`.
- Functional/declarative; avoid classes. `function` keyword for pure functions. Declarative JSX.
- Prefer `interface` over `type`. Avoid `enum` — use maps (the lone exception is `utils/enums/`).
- **Named exports** for components. **lowercase-with-dashes** directory names.
- Path alias `@/*` → `src/*`.
- UI is **shadcn/ui** (Radix + Tailwind v4) in `src/components/ui` (`components.json` aliases).
  Rich text is **Lexical**; admin tables use **TanStack Table** (`components/ui/DataTable`); charts
  use **Recharts**; Google Analytics/AdSense via `@next/third-parties` and `src/components/google`.

> Note on formatting: the enforced toolchain is **Oxc** (oxlint + oxfmt) via lint-staged/husky and
> the `lint` / `format` scripts. Style is **tabs + double quotes**. (Historically this was
> Prettier+ESLint, then briefly Biome — both removed.)

> Note: the cursor rules mention `nuqs` for URL state, but it is **not** a dependency — don't reach
> for it.

## Environment

`.env` keys: `NEXT_PUBLIC_API_SERVER` / `API_SERVER` (backend base URL — required, see `routes.ts`),
`NEXT_PUBLIC_IMAGE_SERVER`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `CLIENT_URL` (used by the admin layout
for sign-in/out redirects), and the Google integration keys (`GOOGLE_ANALYTICS_ID`, `GA_CLIENT_EMAIL`,
`GA_PRIVATE_KEY`, `GA_PROPERTY_ID`, `ADSENSE_PUBLISHER_ID`). `next.config.js` restricts remote images
to `vethealth.com.ua` + `*.vethealth.com.ua` (the old `hostname: "*"` open image-proxy was removed —
don't re-add it; add the specific prod image host instead). Ships a `Dockerfile`; deployed via Coolify.
