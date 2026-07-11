# separator

2026-07-06 — strategy: transformation engine (legacy default style). Pristine shadcn wrapper migrated cleanly from `@radix-ui/react-separator` to `@base-ui/react/separator`; one a11y-semantics delta flagged.

## Changed

- `src/components/ui/separator.tsx` — the only file touched.
  - Classified **pristine**: user's file matched the shadcn default golden (`/r/styles/default/separator.json`) byte-for-byte modulo formatting (tabs/double quotes, Tailwind class order `bg-border shrink-0`). No custom classes, exports, or logic to preserve beyond the golden shape.
  - Import rewired: `import * as SeparatorPrimitive from "@radix-ui/react-separator"` → `import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"` (separator.tsx:3). Base UI's Separator is a callable single part (no `.Root`), per universal-patterns.md and `node_modules/@base-ui/react/separator/Separator.d.ts`.
  - `SeparatorPrimitive.Root` → `SeparatorPrimitive` in JSX and in the `React.ElementRef` / `React.ComponentPropsWithoutRef` generics (separator.tsx:9-12). Base export is a `ForwardRefExoticComponent<... RefAttributes<HTMLDivElement>>`, so `ref` forwarding and both type utilities resolve correctly.
  - `decorative` prop removed from the destructure and from the element (separator.tsx:11) — Base UI has no such prop (see display-misc.md separator table). Flagged under Behavior changes.
  - `displayName` now the literal `"Separator"` (separator.tsx:23) — Base UI does not guarantee a `displayName` on the primitive to copy from.
  - Exact user Tailwind classes kept verbatim: `bg-border shrink-0`, `h-[1px] w-full` / `h-full w-[1px]`. class-mapping.md has no separator entries and the classNames contain no `data-*`/CSS-var hooks, so no class rewrites applied. `[data-orientation]` is identical on both sides anyway.
  - Formatted with `pnpm exec oxfmt src/components/ui/separator.tsx` (clean).
  - Leftover scan clean: `grep -n "radix-ui\|@radix-ui\|IconPlaceholder" src/components/ui/separator.tsx` → no matches.

## Left alone

- `src/components/ui/sidebar.tsx` — the sole consumer (`SidebarSeparator`, line ~395). Passes only `ref`, `data-sidebar`, `className`; derives its types from `typeof Separator`, so it keeps compiling unchanged. It is another agent's/component's file in this parallel migration.
- `package.json` — `@radix-ui/react-separator` dependency left for the orchestrator's final dependency sweep (other wrappers are still mid-migration in parallel; removing deps per-agent would race).

## Behavior changes

- **`decorative` prop dropped (was default `true`).** Radix with `decorative` rendered `role="none"`, hiding the rule from assistive tech. Base UI's Separator is always semantic: `role="separator"` (with `aria-orientation` handled by the primitive). Net effect: every `<Separator />` is now announced as a separator by screen readers instead of being ignored. Any consumer passing `decorative` explicitly would now hit a TS error and leak nothing to the DOM — no such consumer exists today (repo grep: only the unrelated Lexical vendored dir mentions the word). Not silently patched (e.g. via `aria-hidden`), per instructions.

## Verify by hand

1. `pnpm dev`, open `/admin` (login required) — the sidebar renders; `SidebarSeparator` rules between sidebar groups look identical: 1px, `bg-sidebar-border`, `mx-2 w-auto`.
2. Inspect a separator in devtools: it is a `<div role="separator">` with `data-orientation="horizontal"` and classes `bg-border shrink-0 h-[1px] w-full ...`.
3. Drop a `<Separator orientation="vertical" className="h-6" />` between two inline items on any page: renders a 1px-wide vertical rule (`h-full w-[1px]` + your height), `data-orientation="vertical"`.
4. Screen reader / a11y tree spot-check: the separator now appears in the accessibility tree (expected post-migration; previously hidden via `decorative`).
