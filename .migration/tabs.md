# tabs

2026-07-06 — strategy: transformation engine (legacy "default" style, user's own file transformed in place). Verdict: migrated cleanly; pristine wrapper, one flagged behavior delta (manual vs automatic activation).

## Changed

- `src/components/ui/tabs.tsx` — migrated `@radix-ui/react-tabs` → `@base-ui/react/tabs`.
  - Classification: **pristine**. The file matched the legacy shadcn "default" tabs verbatim (Tailwind v3-era classes: `shadow-sm`, `focus-visible:outline-none`); the only diff vs today's registry golden is upstream Tailwind v4 class renames (`shadow-xs`, `outline-hidden`) and class reordering — no user customizations. All original class strings kept byte-for-byte except the mechanical rewrites below.
  - Import (tabs.tsx:3): `import * as TabsPrimitive from "@radix-ui/react-tabs"` → `import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"`.
  - Part renames: `TabsPrimitive.Trigger` → `TabsPrimitive.Tab` (tabs.tsx:29), `TabsPrimitive.Content` → `TabsPrimitive.Panel` (tabs.tsx:44). `Root` and `List` unchanged. Exported names (`Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`) and forwardRef/prop shapes unchanged — the sole consumer (`src/app/(dashboard)/admin/posts/components/EditPost/index.tsx`, passes `defaultValue` string + `className`) keeps working with no edits.
  - Class rewrites on TabsTrigger (tabs.tsx:32): `data-[state=active]:bg-background|text-foreground|shadow-sm` → `data-active:*` (Base UI presence attribute). Added `aria-disabled:pointer-events-none aria-disabled:opacity-50` alongside the existing `disabled:*` variants per class-mapping.md (Base UI tabs surface disabled state via `aria-disabled`).
  - `displayName` assignments switched from `TabsPrimitive.X.displayName` to string literals (Base UI only sets displayName in dev builds, so the old form would assign `undefined` in prod).
  - Verified: single-file `tsc` pass clean (isolated tsconfig extending the project one), `oxfmt` applied, leftover scan `grep -n "radix-ui\|@radix-ui\|IconPlaceholder"` on the file is **empty**.

## Left alone

- `src/app/(dashboard)/admin/posts/components/EditPost/index.tsx` — only consumer; uses no `data-[state=...]` selectors, no `activationMode`, no `asChild`. Nothing to change.
- `package.json` — `@radix-ui/react-tabs` dependency left for the orchestrator's final dependency sweep (other components migrate in parallel).

## Behavior changes

- **FLAGGED (not patched): activation mode.** Radix Tabs defaults to `activationMode="automatic"` (arrow-key focus activates the tab). Base UI's equivalent moved to `List.activateOnFocus` and defaults to `false` (manual: arrow keys move focus, Enter/Space activates). Per wrapper-shapes.md the base registry accepts the manual default, so this wrapper does too. To restore Radix behavior a consumer can pass `<TabsList activateOnFocus>`.
- Minor, low-risk deltas inherited from Base UI: `defaultValue` defaults to `0` (first tab active when no value given; Radix had no default active tab — the one consumer always passes `defaultValue`, so unaffected); inactive panels expose `data-hidden` instead of `data-state="inactive"` (nothing styles this); `onValueChange` gains a second `eventDetails` argument and the value type widens to `any` (pass-through here).

## Verify by hand

1. `pnpm dev`, log into `/admin`, open any post's edit page (Admin → Posts → edit).
2. In the "Закріпленна картика" block, click between "Ввести url адресу" and "Завантажити": active tab gets background + shadow, the matching panel swaps in below with `mt-2` spacing.
3. Keyboard: Tab into the tab list, press ArrowRight — focus moves to the other tab **without activating it** (expected new manual behavior); press Enter/Space — tab activates.
4. Focus ring: tabbing onto a tab shows the 2px offset ring; no console errors; inspect the active tab button and confirm `data-active` attribute is present.
