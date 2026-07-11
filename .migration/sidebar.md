# sidebar

2026-07-11, strategy: transformation engine (legacy `default` style). Verdict: migrated — composite wrapper; its only Radix dependency (`Slot`) replaced with a local Base `useRender` shim. No consumers in the project.

## Changed

- `src/components/ui/sidebar.tsx`
  - Removed `import { Slot } from "@radix-ui/react-slot"`; added `import { useRender } from "@base-ui/react/use-render"`.
  - Added a small local `Slot` shim (forwardRef + `useRender({ render: children, ref, props })`) that reproduces Radix Slot's "merge props/ref onto the single child" behavior. This lets the five `const Comp = asChild ? Slot : "<tag>"` sites (`SidebarGroupLabel`, `SidebarGroupAction`, `SidebarMenuButton`, `SidebarMenuAction`, `SidebarMenuSubButton`) stay byte-for-byte identical, including their long Tailwind class strings — lowest-risk transform.
  - `SidebarProvider`: `<TooltipProvider delayDuration={0}>` → `<TooltipProvider delay={0}>` (Base Tooltip prop rename).
  - All consumed wrappers (`Sheet`, `Tooltip`, `Button`, `Input`, `Separator`, `Skeleton`) were already migrated, so `SidebarMenuButton`'s `<Tooltip>/<TooltipTrigger asChild>/<TooltipContent>` composition and the mobile `<Sheet>/<SheetContent>` work unchanged.

Leftover scan: clean.

## Left alone

- No app code imports `sidebar` (verified by grep) — no consumer sweep.
- `use-mobile` hook, `Skeleton`, `Input`, cva variant tables — untouched.

## Behavior changes

- The local `Slot` shim uses `useRender` instead of Radix `Slot`. Merge semantics (props + ref onto child, `className`/`style`/handlers merged) are equivalent for single-child usage, which is all sidebar does.
- Tooltip open delay is now `delay={0}` (was `delayDuration={0}`) — identical instant-open behavior.

## Verify by hand

Currently unused. If adopted: (1) `SidebarProvider` + `Sidebar collapsible="icon"`, collapse it and hover a `SidebarMenuButton` — the tooltip shows instantly to the right; (2) mobile width — the sidebar renders inside a left `Sheet`; (3) `asChild` menu buttons (rendering `<a>`/`<Link>`) still receive the sidebar data-attributes and classes; (4) Cmd/Ctrl-B toggles the sidebar.
