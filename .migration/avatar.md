# avatar

2026-07-06, strategy: transformation engine (legacy default style). Verdict: pristine wrapper, clean 1:1 migration to `@base-ui/react/avatar`; all classes and exports preserved.

## Changed

- `src/components/ui/avatar.tsx` — the only file touched.
  - Classification vs the shadcn default-style golden (`https://ui.shadcn.com/r/styles/default/avatar.json`): **pristine**. Differences were formatting-only (tabs/double quotes, import/export ordering, Tailwind class order in Fallback — identical class set, no extra exports, no logic).
  - `avatar.tsx:3` — import rewired: `import * as AvatarPrimitive from "@radix-ui/react-avatar"` → `import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"` (namespace import becomes named import per universal-patterns).
  - Part mapping is 1:1 per display-misc.md: `Root → Root`, `Image → Image`, `Fallback → Fallback`. Confirmed against `node_modules/@base-ui/react/avatar/index.parts.d.ts`.
  - Prop types switched to the Base UI namespaces: `React.ComponentPropsWithoutRef<typeof AvatarPrimitive.X>` → `AvatarPrimitive.X.Props` (`avatar.tsx:10`, `:25`, `:37`). Ref generics unchanged (`React.ElementRef<typeof AvatarPrimitive.X>` still resolves — all three Base parts are `ForwardRefExoticComponent`s: Root/Fallback → `HTMLSpanElement`, Image → `HTMLImageElement`, verified in the `.d.ts` files).
  - `displayName` assignments changed from `AvatarPrimitive.X.displayName` to literal strings (`"Avatar"`, `"AvatarImage"`, `"AvatarFallback"`) — Base UI primitives do not define `displayName`, so copying it would assign `undefined` (`avatar.tsx:21`, `:33`, `:48`).
  - All Tailwind classes kept byte-for-byte. No `data-[state=...]`/`--radix-*` hooks existed in the classNames, so no class-mapping rewrites were needed.
  - Formatted with `pnpm exec oxfmt src/components/ui/avatar.tsx` (tabs + double quotes preserved).
  - Leftover scan clean: `grep -n "radix-ui\|@radix-ui\|IconPlaceholder" src/components/ui/avatar.tsx` → no matches.

## Left alone

- `src/app/(dashboard)/admin/users/components/UserMenu.tsx` — sole consumer; uses only `<Avatar><AvatarFallback>…` with plain children (no `asChild`, `delayMs`, or `onLoadingStatusChange`), so it needs no changes.
- `package.json` — `@radix-ui/react-avatar` dependency removal is left to the orchestrator's final cleanup pass (other agents are migrating in parallel; not safe to prune deps from a single-component agent).

## Behavior changes

Flagged wrapper-surface deltas (none exercised by current consumers):

1. `asChild` is no longer accepted on any part — Base UI uses `render={<el/>}` instead. A consumer passing `asChild` would now leak it to the DOM.
2. `AvatarFallback`: Radix `delayMs` prop is renamed to `delay` in Base UI. `delayMs` would be silently ignored (leaked to the DOM span). Not silently patched in the wrapper — flagged here.
3. `className`/`style` on all parts now also accept a function of the part state (`{ imageLoadingStatus }`) — additive, no break.
4. Base UI `Avatar.Image` emits `data-starting-style`/`data-ending-style` during load transitions (Radix documented no data attributes). Additive; no styles in this project target them.

## Verify by hand

1. `pnpm dev`, log in, open any `/admin` page.
2. Top-right user menu: the round avatar with the `User` icon fallback renders as a 40×40 circle (h-10 w-10, `bg-muted`), icon centered.
3. Click it — the dropdown ("Профіль" / "Вихід") still opens; avatar acts as the trigger content without layout shift.
4. Optional: temporarily add `<AvatarImage src="/favicon.ico" alt="" />` above the fallback — image should fill the circle (aspect-square, rounded), and the fallback should show when `src` is broken.
