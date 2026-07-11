# project — Radix UI → Base UI (whole-project)

2026-07-11. Whole-project migration of the frontend off `@radix-ui/*` onto
`@base-ui/react` (`^1.6.0`). **Complete: 0 wrappers remain on Radix; production
build passes.** Style is the legacy `default` (unprefixed) shadcn style, so the
work used the **transformation engine** (rewire primitives, keep the user's
exact classes + Tailwind-v4 modernizations), not golden-pair replay — there is
no `base-default` registry variant.

## Wrappers migrated (20)

Prior session: `avatar, breadcrumb, button, dialog, dropdown-menu, label,
popover, scroll-area, separator, switch, tabs, accordion`.
This session: `command, tooltip, sheet, form, navigation-menu, sidebar, toast`
(+ `use-toast.ts`, `toaster.tsx` as the coordinated toast trio). Per-component
reports live alongside this file.

## Fixes to prior-session wrappers

The earlier pass left a few defects that this session corrected (found via
`pnpm type-check`):
- `dialog.tsx` — `DialogTrigger`/`DialogClose` had been reduced to bare
  re-exports, dropping `asChild` and **breaking 10 consumer sites** (`asChild`
  on triggers/closes across the 5 admin `columns.tsx`). Restored as `asChild`→
  `render` compat shims.
- `popover.tsx` — `PopoverTrigger` given the same `asChild` shim (combobox uses
  `<PopoverTrigger asChild>`).
- `dropdown-menu.tsx` — `DropdownMenuTrigger` ref type `React.ElementRef<…>` →
  `HTMLButtonElement` (the generic Base trigger ref intersection didn't accept
  the old type).
- `combobox.tsx` — `w-[var(--radix-popover-trigger-width)]` → `w-[var(--anchor-width)]`.

**Convention adopted:** triggers/closes that consumers call with `asChild` are
kept as thin `asChild`→`render` shims (matching the precedent already set by
`dropdown-menu.tsx`), rather than sweeping every consumer to Base's `render`
prop. Lowest churn, stable public API.

### `nativeButton` handling in the asChild shims

Base UI trigger/close parts default to `nativeButton={true}` and log a runtime
console error when `render`/`asChild` produces a non-`<button>` element
("expected a native <button> because the `nativeButton` prop is true"). Several
consumers pass non-button children (dropdown trigger → `<div>`, delete
`DialogTrigger` → `DropdownMenuItem` menuitem, `SheetClose` → `<Link>`/`<a>`).
The shims resolve this without touching consumers:
- **One-way parts** (`DialogTrigger`, `DialogClose`, `SheetClose`) pass a blanket
  `nativeButton={false}` on the `asChild` path — safe because open/close is
  idempotent, so any double activation is a no-op.
- **Toggle triggers** (`DropdownMenuTrigger`, `PopoverTrigger`) use a heuristic:
  `nativeButton={false}` only when the child is a **host** element that isn't
  `<button>` (`typeof child.type === "string" && child.type !== "button"`).
  Component children (our `Button`/`IconButton`) stay native — critical so the
  combobox's `PopoverTrigger`→`Button` toggle doesn't double-fire.
- `SheetTrigger` uses the same heuristic; `TooltipTrigger` needs nothing (Base
  `Tooltip.Trigger` renders a generic element, has no `nativeButton`).
- In all shims the injected `nativeButton` is placed **before** `{...props}` so a
  caller can still override it.

Verified with a throwaway jest test (since removed): dropdown-`<div>` and
dialog-menuitem no longer warn, and `PopoverTrigger`→`Button` still renders a
real `<button>`.

## App-code sweep

- **`asChild`** — handled by the wrapper shims above; no consumer edits needed
  for dialog/popover/tooltip/sheet triggers.
- **VisuallyHidden** (no Base equivalent) → `className="sr-only"`:
  `(public)/components/Navigation/Search/index.tsx`,
  `Navigation/Mobile/index.tsx`. Radix VH import removed from both.
- **Lexical `ToolbarPlugin`** imported `DropdownMenuItem` directly from
  `@radix-ui/react-dropdown-menu` while using our migrated `DropdownMenu`/
  `Content`/`Trigger` — repointed that one import to `@/components/ui/dropdown-menu`
  so all parts share the Base menu context. (Only a call site of our migrated
  wrapper was touched; no Lexical internals.)
- **Tooltip** — `sidebar.tsx` `delayDuration={0}` → `delay={0}`.
- Hard-rule libraries left untouched: **cmdk** (command), **react-select**,
  **recharts**, **Lexical** vendored editor, **react-hook-form**.

## Dependency swap

- Removed 16 packages: `@radix-ui/react-{accordion,avatar,dialog,dropdown-menu,
  label,navigation-menu,popover,scroll-area,select,separator,slot,switch,tabs,
  toast,tooltip,visually-hidden}` (`pnpm remove` → 29 pkgs incl. transitives).
- `@base-ui/react@^1.6.0` is the sole primitive library.
- Whole-repo grep for `@radix-ui` (excluding node_modules/lockfile): **none**.

## Verification vs baseline

- `pnpm type-check` — **0 errors**.
- `pnpm lint` (oxlint) — **0 errors**, warnings only, all pre-existing
  (no-array-index-key, no-shadow, jsx-no-constructed-context-values — the last
  two also present in the original files).
- `pnpm build` (Next 16 Turbopack) — **success**: compiled in ~6s, TypeScript
  clean, all 20 static pages generated, every admin + public route built.
- Confirmed Tailwind v4.2 natively compiles the Base UI data-attribute variants
  the migration relies on (`data-open:`, `data-starting-style:`,
  `data-ending-style:`, `data-popup-open:`, `data-active:`, `group-data-…:`) →
  `&[data-*]` selectors. **No `globals.css` custom variants were needed.**

## Flagged (not patched)

- **`components.json` style is still `default`** (there is no `base-default`
  variant to switch to). Future `shadcn add <component>` will deliver **Radix**
  variants; add components manually or re-point the style before using the CLI.
- **NavigationMenu Indicator** has no Base equivalent (kept as an `Icon`-backed
  passthrough; no active-trigger tracking). Component currently has no
  consumers. See `navigation-menu.md`.
- **Toast** semantics shifted to Base's manager (auto-dismiss ~5s, `limit` 3).
  Set `<Toast.Provider limit={1} timeout={0}>` to restore the old single/no-auto
  behavior if desired. See `toast.md`.

## Manual QA still worth doing

`pnpm dev` and click through: admin edit dialogs (focus return, `asChild`
triggers), dropdown menus (keyboard nav, submenus), the multi-select combobox
(popup width = trigger width, cmdk filtering), admin toasts (variants, auto-
dismiss, swipe), and the public mobile menu / search sheets (slide direction,
sr-only titles).
