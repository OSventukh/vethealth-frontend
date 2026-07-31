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
  `admin/layout.tsx` is the **auth gate**: it calls `auth()` and, if there's no session, redirects
  to `/auth/login`. Every admin page is a child of this guarded layout.
- `auth/` — login / confirmation / forgot-password flows.
- There are **no API routes** — auth is handled by iron-session cookies + server actions, not a
  NextAuth route handler.

### Page builder (pages = block documents, 2026-07)

Pages (адмінка `admin/pages` + публічний рендеринг) працюють через **конструктор блоків**, а не
"один великий Lexical" (так лишилось тільки в постах):
- **Модель**: `pages.content` зберігає JSON `{version: 1, blocks: [{id, type, data}]}` —
  типи/парсинг у `src/lib/page-builder/` (`parsePageDocument` повертає `null` для легасі
  Lexical-контенту; `createDocumentFromLegacy` загортає його в один `richtext`-блок).
  11 типів блоків: hero, heading, richtext (Lexical), stats, services, team, gallery, image,
  cta, faq, contacts. Реєстр міток/дефолтів — `lib/page-builder/defaults.ts`.
- **Публічний рендеринг**: `src/components/page-blocks/` — по одному JSX-компоненту на блок
  (server-safe; ті самі компоненти рендеряться в канвасі адмінки). `PageContent` — точка входу:
  builder-документ → блоки, легасі-рядок → `ParsedContent` (fallback лишається назавжди — на
  випадок невідмігрованих рядків). Не імпортувати сюди адмінських/Lexical-редакторських модулів.
- **Адмін-редактор** (`admin/pages/components/`): канвас з превʼю (реальні блок-компоненти,
  richtext = інлайновий Lexical), панель «Структура», інспектор блоку, пікер секцій (Dialog),
  таби Блоки / SEO (SEO мапиться на бекендову `metadata`-сутність; PATCH шле metadata без id —
  бекенд каскадно створює новий рядок). Статуси збережено як було: «Опублікувати» → OnReview(3),
  «Чернетка» → Draft(2).
- Бекенд-міграція `PagesBuilderContent` загорнула наявні сторінки в richtext-блок і розширила
  `pages.content` до MEDIUMTEXT; `?include=metadata` дозволено в `PageQueryDto`.

### SEO layer (2026-07)

Публічні роути мають окремий SEO-шар у `src/app/(public)/_lib/`:
- **`resolve-path.ts`** — єдине джерело істини «чи існує URL»: валідує ланцюжок тем
  (кожен сегмент, крім останнього, — тема; parent→child збігається з URL, перша тема коренева)
  і належність поста останній темі шляху. Повертає `{type: "post"|"page", …}` або `null`.
  Особливий випадок — **hub-пости**: пост зі слагом, що збігається зі слагом однойменної підтеми
  (`/drugs/antiparasitic-drugs`) — приймається, якщо пост прив'язаний або до батьківської, або до
  однойменної теми. Пости без тем взагалі — пропускаються (толерантність до старих даних).
- **`seo.ts`** — `buildContentMetadata()` (пріоритет: SEO-поля з адмінської `metadata`-сутності →
  фолбеки з контенту; завжди ставить canonical, og:images, siteName/locale) та
  `extractDescription()` (текст з Lexical, обрізаний до ~160 символів).
- **Справжні 404**: валідація викликається в **layout-компонентах** (`[topic]/layout.tsx`,
  `[topic]/[...slug]/layout.tsx`), бо layout рендериться до першого flush — `notFound()` звідти дає
  реальний HTTP 404. `notFound()` зі стрімленої сторінки (за межею loading.tsx) віддає 200 (soft-404).
  **Тому `[topic]/loading.tsx` видалено і його не можна повертати** — він створює Suspense-межу
  навколо всього сегмента `[...slug]`, і статус фіксується як 200 до валідації.
  `[...slug]/loading.tsx` лишився — він нижче валідуючого layout і безпечний.
- **`content-cache.ts`**: include-параметри зафіксовані (`children,parent,metadata` для тем,
  `topics,metadata` для постів) — однакові аргументи в усіх викликах = один запит на рендер
  (React.cache). Не міняти include в одному місці без інших.
- **`app/sitemap.ts`** — `force-dynamic`, але всі фетчі йдуть через Data Cache (force-cache + tags),
  тож оновлюється одразу після `revalidateTag` з адмінки. Hub-пости не дублюють слаг у URL.
  `app/robots.ts` віддає `Sitemap:` лише в production.
- Canonical на сторінках тем ігнорує `?category=` (metadata генерується в layout, який не бачить
  searchParams — це навмисно). `/search` — `noindex, follow`.
- Внутрішні посилання (`PostItem`, `TopicItem`) — **тільки абсолютні** (`/topic/slug`): відносні
  href без слеша створювали дублікати довільної глибини, які тепер 404.
- **5xx ≠ 404 (`src/api/request.ts`)**: `get()` повертає `null` лише на 4xx; мережеві помилки та
  5xx **кидаються** далі (падіння бекенду не має виглядати як масові 404 → деіндексація) і ловляться
  root `app/error.tsx` (статус 500). Закешовані сторінки при лежачому бекенді далі віддаються з
  Data Cache. Не повертати `get()` до «ніколи не кидає».
- **JSON-LD** (`src/components/seo/json-ld.tsx` — data-блок, CSP-nonce не потрібен): Article у
  `Post/index.tsx`, BreadcrumbList у `custom-breadcrumb.tsx`, WebSite+SearchAction+Organization на
  головній, FAQPage у `faq-block.tsx`. Абсолютні URL — через `absoluteUrl()`/`getBaseUrl()` з
  `_lib/seo.ts` (CLIENT_URL).
- **Пагінація тем**: `?page=` у `[topic]/page.tsx` (`generateMetadata` дає self-canonical для
  сторінок 2+; для `?category=` canonical лишається `/topic`), UI — `PostList/PaginationNav.tsx`
  (справжні `<a>`). Без неї пости після 10-го в темі були недосяжні для краулерів.
- **`app/llms.txt/route.ts`** — markdown-огляд для AI-краулерів (дані з `src/lib/content-index.ts`,
  спільного з sitemap). `robots.ts` має окрему allow-групу AI-ботів (GPTBot, ClaudeBot,
  PerplexityBot, Google-Extended тощо) — політика проєкту: контент відкритий для LLM-видач.
- Favicon-набір і `site.webmanifest` з `public/favicon/` підключені через `icons`/`manifest`
  у root layout.

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

### Auth (`src/lib/session`) — iron-session

Migrated off NextAuth v4 to **iron-session** (the backend NestJS API stays the source of truth;
the frontend just transports its JWTs in an encrypted, stateless cookie).
- `session.config.ts` — the `SessionData` shape (`user`, `token`, `refreshToken`, `tokenExpires`)
  and `sessionOptions` (cookie name `vethealth_session`, `password: process.env.AUTH_SECRET` — must
  be **≥32 chars**, `maxAge` = backend refresh-token TTL of 7d).
- `auth.ts` — the `auth()` helper reads the cookie via `getIronSession(await cookies(), …)` and
  returns the session or `null` (mirrors the old `getServerSession` contract, so the ~24 call sites
  doing `session?.token` / `session?.user` are unchanged). **Read-only** — it never writes cookies.
- **Login/logout are server actions** (`auth/actions/login.action.ts`, `auth/actions/logout.action.ts`):
  they call `api.auth.login` / `api.auth.logout`, then `session.save()` / `session.destroy()`.
- **Token auto-refresh lives in `src/proxy.ts`** (the Next 16 proxy, formerly `middleware.ts`), NOT
  in `auth()`: cookies cannot be written during a Server Component render, so the proxy checks
  `tokenExpires` and rotates via `api.auth.refresh`, writing the new cookie onto its response. The
  proxy always runs on the **Node.js runtime**, so the server-only `api` client (which dynamically
  imports winston) is safe there.

### Server actions (`actions/` dirs colocated with routes)
Mutations live in `*.action.ts` files marked `"use server"`, colocated under each route
(e.g. `admin/posts/actions/save-post.action.ts`, `auth/actions/login.action.ts`). Conventions:
- Shaped for `useActionState`: `(state, formData) => { error, success, message, redirect? }`.
- Read the session via `auth()`, send the bearer token, then `revalidateTag(...)` to invalidate the
  ISR cache for the affected resource.
- Backend error strings are matched against `utils/constants/server-error-responses` and remapped to
  user-facing Ukrainian messages in `utils/constants/messages`.
- The one shared, non-route-specific action lives in `src/actions/` (`image-upload.action.ts`,
  used by the Lexical editor).

### Security headers (`src/proxy.ts` — Next 16's middleware)
Runs on every request except `api/`, `_next/*` and prefetches. Its `proxy()` function sets a
**nonce-based CSP** (nonce forwarded to the app via the `x-nonce` request header), HSTS,
`X-Frame-Options: DENY`, `X-Content-Type-Options`, `Referrer-Policy`, and a deny-most
`Permissions-Policy`; it also rotates the backend access token (see the Auth section). Gotchas:
- **Any new external origin must be allowlisted here** — third-party scripts go in `script-src`,
  API/analytics endpoints in `connect-src`, image hosts in `img-src` (`PROD_ORIGINS` covers the
  `vethealth.com.ua` hosts). Git history is full of "fix CSP" commits from forgetting this; a missed
  entry only breaks in prod-like environments, since localhost gets the looser dev policy.
- Dev vs prod policy is chosen by sniffing the `host` header for `localhost`/`127.`, not `NODE_ENV`.

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
`NEXT_PUBLIC_IMAGE_SERVER`, `AUTH_SECRET` (iron-session cookie encryption key — **≥32 chars**;
replaced the old `NEXTAUTH_SECRET`/`NEXTAUTH_URL`), `CLIENT_URL` (`metadataBase` in the root layout +
auth redirects), and the Google integration keys (`GOOGLE_ANALYTICS_ID`, `GA_CLIENT_EMAIL`,
`GA_PRIVATE_KEY`, `GA_PROPERTY_ID`, `ADSENSE_PUBLISHER_ID`). Third-party scripts are env-gated:
AdSense renders only when `ADSENSE_PUBLISHER_ID` is set (ads are currently OFF — the var is unset
everywhere), and the CRO optimizer script (the owner's local copy, served from
`optimize.vethealth.com.ua`) renders only when `OPTIMIZER_ENABLED=true` (**staging only** — it's a
work-project testbed; never enable in production).
`next.config.js` restricts remote images
to `vethealth.com.ua` + `*.vethealth.com.ua` (the old `hostname: "*"` open image-proxy was removed —
don't re-add it; add the specific prod image host instead). Ships a `Dockerfile`; deployed via Coolify.
