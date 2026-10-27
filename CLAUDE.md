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
- **Справжні 404 робить `proxy.ts`, а не рендер (2026-08-16).** Під `cacheComponents: true`
  валідація в layout/page більше не може виставити статус: shell (`app/layout.tsx` + чрома
  `(public)`) пререндериться і флашиться ПЕРШИМ, тож 200 зафіксовано ще до того, як сторінка
  дійде до `notFound()`. Заміряно на standalone-сервері: неіснуючі URL віддавали **200**
  однаково і з `export const instant = false` на роуті, і без нього. Тому:
  - проксі до рендера перевіряє контентні URL (`src/lib/content-path.ts`) і на неіснуючих
    робить `rewrite` на внутрішній **`/_not-found`** — саме цей роут віддає HTTP 404.
    `rewrite(url, { status: 404 })` **не працює**: Next бере статус із того, що відрендерилось.
  - `src/app/not-found.tsx` (кореневий) існує лише заради цього: без нього на `/_not-found`
    показувався б дефолтний англомовний екран Next замість сторінки сайту.
  - валідацію прибрано з `[...slug]/layout.tsx` (вона блокувала пререндер shell і при цьому
    не давала обіцяного 404); `resolvePath` + `notFound()` лишились у `page.tsx` — вони й далі
    малюють «Сторінка не знайдена», якщо URL проскочив повз проксі.
  - **Правила валідації одні на двох**: `resolvePathWith(fetchers, …)` у `_lib/resolve-path.ts`.
    Рендер передає кешовані фетчери, проксі — прямі (в проксі немає ні Data Cache, ні
    "use cache"). Не дублювати цю логіку — розбіжність означала б 404 на живій сторінці.
  - **Fail-open**: будь-яка помилка бекенда трактується як «сторінка існує» (заміряно: з
    лежачим бекендом URL віддають 200, не 404) — інакше збій бекенда викосив би сайт з індексу.
  - Кеш у памʼяті процесу: 60 с на позитивні відповіді, 15 с на негативні (щойно опублікований
    пост не має 404-итись довго). Заміряно: 5 однакових запитів = 1 звернення до бекенда.
  - Новий топ-рівневий роут або тека в `public/` **мусять** потрапити в `RESERVED_SEGMENTS`
    (`src/lib/content-path.ts`), інакше проксі віддасть на них 404. Стереже
    `__test__/content-path.test.ts`.
- **`content-cache.ts`**: include-параметри зафіксовані (`children,parent,metadata` для тем,
  `topics,metadata` для постів) — однакові аргументи в усіх викликах = один запит на рендер.
  Не міняти include в одному місці без інших. З 2026-08-16 це не `React.cache`, а **`"use cache"`
  + обовʼязковий `cacheTag(TAGS.*)`**: без тега `updateTag` з адмінки не дістав би до цих
  записів і публікація не зʼявлялася б на сайті. Саме ці кеш-межі дозволяють публічним роутам
  пререндеритись під `cacheComponents` (те саме зроблено для `privacy-policy`).
  У jest `next/cache` підмінено стабом (`__mocks__/next-cache.js` через `moduleNameMapper`) —
  інакше серверні модулі Next тягнуть у jsdom `Request`/`TextEncoder`, яких там немає.
- **`app/sitemap.ts`** — `force-dynamic`, але всі фетчі йдуть через Data Cache (force-cache + tags),
  тож оновлюється одразу після `updateTag` з адмінки. Hub-пости не дублюють слаг у URL.
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

### ШІ-генерація SEO-мета в адмінці (2026-08)

Кнопка **«Заповнити з ШІ»** в SEO-вкладках постів і сторінок генерує metaTitle/metaDescription/
metaKeywords/ogTitle/ogDescription з тексту контенту:
- `admin/components/generate-seo-button.tsx` (спільна кнопка) + `admin/actions/generate-seo.action.ts`
  (server action → `POST /ai/seo-metadata` бекенда з bearer-токеном). Бекенд-провайдер/модель
  налаштовуються env-ами бекенда (`AI_PROVIDER`: anthropic|openai|google); без API-ключа бекенд
  віддає 503 з `AI_NOT_CONFIGURED` і юзер бачить тост «ШІ не налаштовано».
- Заповнюються **лише порожні** поля форми (ручні значення не перетираються); нічого не
  автозберігається — редактор переглядає і тисне «Зберегти».
- **Перевірка порожності — по актуальному стану на момент завершення генерації, не по
  замиканню з моменту кліку** (інакше значення, введене вручну під час генерації,
  перетирається): у постів це `form.getValues()` всередині `applyGenerated`; у сторінок —
  колбек `applyGeneratedMetadata` живе в батьківському `EditPage` (`pages/components/index.tsx`)
  і читає `metadataRef` (сам `SeoTab` розмонтовується при перемиканні вкладок, тому ref у
  ньому не допоміг би). Регресійний тест — в `edit-page-builder.test.tsx`.
- server action має 45-с таймаут (`AbortSignal.timeout`) — трохи довший за 30-с таймаут
  генерації на бекенді, щоб штатний **504** приходив раніше за обрив з'єднання.
- **Повідомлення про помилки — `admin/actions/seo-error-message.ts`** (окремий модуль: з
  "use server"-файлу можна експортувати лише async-функції). Порядок: **`errorCode`** з тіла
  відповіді бекенда (`ERROR_CODE_MESSAGES`, дзеркало `backend/src/modules/ai/ai-error-codes.ts`) →
  статус (`STATUS_MESSAGES`) → загальний fallback. Код розводить те, що статус склеює:
  відсутній vs відхилений ключ (обидва 503), ліміт провайдера vs наш тротлер (обидва 429; у
  тротлера коду немає). Для `AI_RATE_LIMITED` секунди беруться з `Retry-After`.
  **5xx БЕЗ коду — це не ШІ, а проксі/балансер** (напр. Traefik під час редеплою), тож
  `STATUS_MESSAGES` для 502/503/504 навмисно нейтральне «сервер недоступний» — не повертай туди
  «додайте API-ключ». 401 і відсутній токен у сесії → «увійдіть знову» (action без токена
  бекенд не викликає). Новий код на бекенді — додати і в `ERROR_CODE_MESSAGES`.
- Текст витягується `src/lib/content-text.ts`: `extractLexicalText` (пости; повний текст, не
  160-символьний `extractDescription` з `(public)/_lib/seo.ts`) і `extractPageBlocksText`
  (сторінки; рекурсивно збирає рядкові поля блоків, пропускає url-подібні ключі).
- **Тести, що монтують редактори, мають мокати `generate-seo.action`** (див. `edit-post.test.tsx`,
  `edit-page-builder.test.tsx`): без мока jest падає на ESM-залежності iron-session
  (`uncrypto`) через ланцюжок імпортів кнопка → action → `auth()`.

### Масове SEO — `/admin/seo` (2026-10)

Екран для Admin+ (пункт «SEO» у сайдбарі): усі теми, пости й окремі сторінки з
заповненістю 5 SEO-полів, масова ШІ-генерація і **збереження лише після перегляду**.
- Дані — бекендовий модуль `seo` (`GET /seo/entries`, `POST /seo/:type/:id/generate`,
  `PATCH /seo/:type/:id`; див. `backend/CLAUDE.md`). Текст для промту бекенд бере з БД сам,
  тож фронтенд контент не тягне. Сторінки, привʼязані до теми, у списку відсутні — їхня
  URL = URL теми, і мета береться з теми. Так само (на фронтенді, у `buildSeoEntries`) відсіюються
  теми, чию URL займає **hub-пост**: `resolvePath` віддає за нею пост, тож мета теми там не діє.
- Файли: `admin/seo/seo-fields.ts` (модель, рекомендовані довжини, `buildSeoEntries` — публічні
  URL за правилами sitemap), `run-bulk-generation.ts` (чистий послідовний раннер: на 429 чекає
  `Retry-After`/30 с і повторює той самий матеріал до 3 разів; 401/403 та
  `AI_NOT_CONFIGURED`/`AI_KEY_REJECTED` зупиняють весь прогін), `use-seo-drafts.ts`,
  `actions/seo.action.ts`, `components/*`.
- **Чернетки** (згенероване або виправлене, ще не збережене) живуть у стані + `localStorage`
  (`vethealth:seo-drafts`), щоб оновлення сторінки не губило оплачену генерацію; при
  відновленні вмикається фільтр «Лише незбережені». Чернетка, що збігається зі збереженим,
  автоматично прибирається. Зберігаються **лише змінені поля** (`PATCH` з ними); порожній
  рядок очищає поле.
- Масова генерація без «Перезаписувати заповнені поля» просить у ШІ **лише порожні** поля.
  Точкова правка: у кожного поля кнопка ШІ (перегенерувати одне поле з урахуванням решти і
  «побажання для ШІ» картки) і «повернути збережене».
- Помилки — той самий `seo-error-message.ts` (+ код `SEO_NO_CONTENT`: у матеріалі немає тексту).

### Медіатека — `/admin/media` + пікер у формах (2026-10)

Пункт «Медіа» в сайдбарі: усі завантажені зображення (рядки `files` бекенда, модуль `media` —
див. `backend/CLAUDE.md`), пошук, фільтр «Лише без alt», масове завантаження, панель деталей
(alt + «Згенерувати ШІ», де використовується з посиланнями на редактори, видалення — лише
Admin+; якщо файл використовується, діалог показує список і просить підтвердити).
- **Права**: alt, ШІ-генерація, масові дії й видалення — лише Admin+ (бекенд дає 403).
  Роль відома лише на сервері, тож admin-layout кладе її в `MediaPermissionsProvider`
  (`media-library/media-permissions.tsx`, `useCanManageMedia()`, дефолт — false). Автори
  бачать і завантажують файли, а в пікері пишуть alt лише для поточного матеріалу (у
  медіатеку він не зберігається, кнопки ШІ немає). Тести пікера з адмінськими діями
  обгортають його в провайдер.
- Спільні клієнтські частини — `src/components/media-library/`: `use-media-list` (пагінація,
  дебаунс пошуку, локальні prepend/replace/remove), `media-grid`, `media-upload-button`
  (файли по одному — ліміт `bodySizeLimit` server action), `alt-text-editor` (ШІ лише
  підставляє текст), `media-picker` (`MediaPickerPanel` + `MediaPickerButton` з діалогом).
  Server actions — `src/actions/media.action.ts`; помилки ШІ — той самий
  `seo-error-message.ts` (+ коди `MEDIA_*`, параметр `fallback` для не-SEO задач).
- Пікер «З медіатеки» вбудовано в `ImageUpload` (картинка теми, обкладинка й OG поста),
  `pages/components/image-field.tsx` (блоки сторінок: збережений alt підставляється в alt
  блоку) і в діалог вставки картинки Lexical (режим «З медіатеки» рендерить панель інлайново —
  без вкладеного діалогу). Alt, змінений у пікері, **зберігається і в медіатеку**.
- Публічно alt із медіатеки бачать обкладинки (`featuredImageFile.alt`) і картинки тем
  (`image.alt`); у вже вставлених у текст картинках alt — той, що був при вставці.
- **Hotlink Protection у Cloudflare** на `dev-cdn.vethealth.com.ua` віддає **403** на
  jpg/jpeg/png (не svg/avif) з чужим Referer — з адмінки на localhost/staging превʼю порожні.
  Тому `<img>` медіатеки мають `referrerPolicy="no-referrer"` (`ADMIN_IMAGE_REFERRER_POLICY`).
  Старі превʼю форм (обкладинка поста через CSS `background-image`, `ImageUpload`) локально
  так само порожні — це не баг коду.
- **Масові дії** (`admin/media/`): «Згенерувати alt для всіх без alt» і «Вибрати кілька» →
  згенерувати alt / видалити. Генерація йде **тим самим раннером, що масове SEO**
  (`seo/run-bulk-generation.ts`, тепер generic за входом/результатом: 429 → чекає
  `Retry-After`, 401/`AI_NOT_CONFIGURED`/`AI_KEY_REJECTED` → зупиняє прогін); стан чернеток —
  `use-bulk-alt.ts` у workspace (діалог можна закрити й відкрити — чернетки лишаються,
  `beforeunload` попереджає). Зберігаються лише переглянуті й відмічені. Фільтри
  «Невикористані» і «Вужчі за N px» — бекендові (`unused`, `narrowerThan`).
- Довантаження списку йде за **`offset` = скільки вже показано**, а не `page + 1`: після
  локальних prepend/remove межі серверних сторінок зсуваються (дублі/пропуски).
- У теми картинка one-to-one: пікер у формі теми отримує `validatePick`
  (`EditTopic/topic-image-conflict.ts`) і не дає обрати картинку іншої теми; бекенд на це
  відповідає 409 `TOPIC_IMAGE_TAKEN`. Вибір картинки в блоці сторінки **замінює** alt блоку
  alt-ом із медіатеки (або очищає), а не лишає alt попереднього зображення.
- `topic.image` тепер може бути `null` (примусове видалення обнуляє FK) — `TopicImage`
  рендерить порожню плитку.
- **Тести, що монтують редактори/форми з картинками, мають мокати `media.action`** (як і
  `generate-seo.action`): інакше ланцюжок пікер → action → `auth()` тягне ESM iron-session.

### API client (`src/api`) — the most important subsystem
- `routes.ts` builds endpoint URLs from `NEXT_PUBLIC_API_SERVER` || `API_SERVER`, and **throws at
  import time if neither is set**.
- `request.ts` exposes `get` / `post` / `remove` / `sendFile`. Critical behaviors:
  - **Caching is decided by auth**: unauthenticated `get` uses `cache: "force-cache"` plus Next
    `{ next: { tags, revalidate } }` (ISR). Any request with a `token`, or `revalidate: false`,
    uses `cache: "no-store"`. Don't pass a token to data you want cached.
  - `get` returns `null` on 4xx (callers must null-check) but **throws** on network errors and 5xx
    (see "5xx ≠ 404" in the SEO layer section). `post` / `remove` / `sendFile` **do throw** on non-OK.
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
- Read the session via `auth()`, send the bearer token, then `updateTag(...)` to invalidate the
  cache for the affected resource. **Not `revalidateTag(tag, "max")`** (changed 2026-10-10): that is
  stale-while-revalidate — the first visitor after a publish still got the old version, and with
  two cache layers (`"use cache"` over a tagged `force-cache` fetch) the background regen could
  re-cache stale data. `updateTag` expires immediately; it's Server-Action-only, which all of ours are.
- Backend error strings are matched against `utils/constants/server-error-responses` and remapped to
  user-facing Ukrainian messages in `utils/constants/messages`.
- The one shared, non-route-specific action lives in `src/actions/` (`image-upload.action.ts`,
  used by the Lexical editor).

### Security headers (`src/proxy.ts` — Next 16's middleware)
Runs on every request except `api/`, `_next/*` and prefetches. Its `proxy()` function sets a
**nonce-based CSP** (nonce forwarded to the app via the `x-nonce` request header), HSTS,
`X-Frame-Options: DENY`, `X-Content-Type-Options`, `Referrer-Policy`, and a deny-most
`Permissions-Policy`; it rotates the backend access token (see the Auth section); and it
emits **справжні HTTP 404** для неіснуючих контентних URL (див. «Справжні 404» вище —
там же чому це не можна зробити в рендері). Gotchas:
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
everywhere), and the CRO optimizer script (the owner's build, loaded from
`optimizer.oskh.com.ua/comp/XoQrlB9WgF.js`; it reports to
`crsoptimizer.conversionrate.store` — both hosts are in the CSP allowlists in `src/proxy.ts`)
renders only when `OPTIMIZER_ENABLED=true` (**staging only** — it's a
work-project testbed; never enable in production). The Mida.so A/B script
(`cdn.mida.so/js/optimize.js`, `src/components/external-scripts/mida.tsx`; `https://*.mida.so` is in
script-src/connect-src/img-src) follows the same rule behind its own `MIDA_ENABLED=true` (staging only).
`next.config.js` restricts remote images
to `vethealth.com.ua` + `*.vethealth.com.ua` (the old `hostname: "*"` open image-proxy was removed —
don't re-add it; add the specific prod image host instead). Ships a `Dockerfile`; deployed via Coolify.
