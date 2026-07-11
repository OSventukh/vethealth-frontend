# breadcrumb

2026-07-06 — strategy: transformation engine (legacy `default` style, user file transformed in place). Verdict: migrated cleanly; only `BreadcrumbLink` touched Radix (Slot) and now uses Base UI `useRender` + `mergeProps`.

## Changed

- `src/components/ui/breadcrumb.tsx` — the only file touched.
  - Classified against the shadcn default-style golden (`https://ui.shadcn.com/r/styles/default/breadcrumb.json`): **pristine**. The diff is exclusively formatting (tabs, double quotes, semicolons, import/export ordering — the project's oxfmt style) and equivalent Tailwind modernizations (`[&>svg]:size-3.5` vs golden's `[&>svg]:w-3.5 [&>svg]:h-3.5`, class-order shuffles). No custom classes, no extra exports, no logic changes to preserve beyond the file's own style.
  - Imports (breadcrumb.tsx:1-2): `import { Slot } from "@radix-ui/react-slot"` replaced by `import { mergeProps } from "@base-ui/react/merge-props"` and `import { useRender } from "@base-ui/react/use-render"` per universal-patterns.md (Slot/asChild → useRender/mergeProps for non-button polymorphic components).
  - `BreadcrumbLink` (breadcrumb.tsx:43-57): the manual Slot idiom (`const Comp = asChild ? Slot : "a"`) rewritten to `useRender({ defaultTagName: "a", render, ref, props: mergeProps<"a">(...) })`. Prop type is now `useRender.ComponentProps<"a">` (`render` replaces `asChild`). Kept `React.forwardRef<HTMLAnchorElement, ...>` (the file's prevailing style) and passed `ref` through useRender's dedicated `ref` parameter — mergeProps does not merge refs, verified against `node_modules/@base-ui/react/merge-props/mergeProps.d.ts` and `use-render/useRender.d.ts`. Class string `"hover:text-foreground transition-colors"` byte-identical. No `data-*` keys in the mergeProps literal, so the excess-property cast pitfall does not apply here.
  - All other parts (`Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbPage`, `BreadcrumbSeparator`, `BreadcrumbEllipsis`) were plain HTML elements with no Radix involvement — left byte-identical, including the upstream `"BreadcrumbElipssis"` displayName typo (faithful to golden).
  - class-mapping.md: no `data-[state=...]` attributes or `--radix-*` CSS vars appear in any className — no rewrites needed.
  - Export list and names unchanged; shadcn-compatible.
  - Leftover sweep clean: `grep -n "radix-ui\|@radix-ui\|IconPlaceholder" src/components/ui/breadcrumb.tsx` → no matches.
  - Formatted with `pnpm exec oxfmt src/components/ui/breadcrumb.tsx` (no changes reported) and re-read to confirm.

## Left alone

- `src/components/ui/custom/custom-breadcrumb.tsx` — the only in-repo consumer; uses `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbPage`, `BreadcrumbSeparator` only (links rendered as raw `next/link` inside `BreadcrumbItem`, not via `BreadcrumbLink`). No `asChild` usage anywhere in `src/` — no consumer changes required.
- `src/app/(public)/**` pages that render `CustomBreadcrumb` — unaffected (props unchanged).
- `package.json` — `@radix-ui/react-slot` NOT removed: other ui wrappers (e.g. button) may still import it while the parallel migration is in flight. Remove it in the final dependency sweep once no file imports it.

## Behavior changes

- `BreadcrumbLink`: the `asChild?: boolean` prop is gone; polymorphism is now via Base UI's `render` prop (`<BreadcrumbLink render={<Link href=... />} />`). Grep confirms zero `asChild`/`BreadcrumbLink` consumers in this repo, so nothing breaks today — but any future copy-pasted shadcn/radix snippet using `asChild` will type-error instead of slotting.
- `mergeProps` merges `className` by concatenation in right-to-left order (rightmost first) — for a single default class + user `className` this is visually equivalent to the old `cn(...)` result; noted for completeness.

## Verify by hand

1. `pnpm dev`, open any public post page (e.g. a `/[topic]/[...slug]` article) — the breadcrumb trail renders with separators (ChevronRight) between items, current page in `text-foreground`.
2. Inspect the DOM: `<nav aria-label="breadcrumb"> > ol > li` structure intact; current page span has `aria-current="page"`.
3. In a scratch usage, render `<BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>` — it must output a single `<a>` (Next Link) with `hover:text-foreground transition-colors` merged into its class, and hover color change works.
4. Render `<BreadcrumbLink href="/x">plain</BreadcrumbLink>` without `render` — outputs a plain `<a href="/x">`.
