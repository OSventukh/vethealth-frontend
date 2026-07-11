# popover
2026-07-06 — strategy: transformation engine (legacy default style; base-default not in registry). Verdict: migrated cleanly; classified pristine (matches an older shadcn default snapshot, no user customizations).

## Changed
- `src/components/ui/popover.tsx` — full rewire from `@radix-ui/react-popover` to `@base-ui/react/popover`.
  - Import: `* as PopoverPrimitive from "@radix-ui/react-popover"` → `{ Popover as PopoverPrimitive } from "@base-ui/react/popover"` (popover.tsx:4).
  - Structure: Radix `Portal > Content` → Base UI `Portal > Positioner > Popup` (popover.tsx:31-41). Positioner gets the conventional `isolate z-50` and NO data-slot (per wrapper-shapes conventions).
  - Positioner FORWARD rule applied: `align` / `alignOffset` / `side` / `sideOffset` are declared via `Pick<PopoverPrimitive.Positioner.Props, ...>`, destructured, and explicitly forwarded to `<PopoverPrimitive.Positioner>` (popover.tsx:16-18, 22-27, 33-36) so they cannot fall through onto the Popup. Defaults preserved: `align="center"`, `sideOffset={4}`.
  - Types: `React.ElementRef<typeof ...Content>` / `ComponentPropsWithoutRef` → `HTMLDivElement` + `PopoverPrimitive.Popup.Props` namespace types (confirmed against `node_modules/@base-ui/react/popover/popup/PopoverPopup.d.ts` and `positioner/PopoverPositioner.d.ts`). `forwardRef` + `displayName` kept (legacy default style); displayName now the literal `"PopoverContent"` (Base UI parts don't expose `.displayName`).
  - Classes (user's exact styling preserved; only class-mapping rewrites applied) (popover.tsx:38):
    - `data-[state=open]:animate-in data-[state=closed]:animate-out` + fade/zoom keyframes → `transition-[translate,scale,opacity]` + `data-starting-style:`/`data-ending-style:` `opacity-0`/`scale-95` (mandated animation-idiom restatement, not a 1:1 rename).
    - Per-side `slide-in-from-*-2` → `data-[side=...]:data-starting-style:*translate-*-2`, keeping the `data-[side=...]` parameterization and the same 0.5rem distances/directions.
    - `origin-[--radix-popover-content-transform-origin]` → `origin-[--transform-origin]` (CSS-var rename only; the user's Tailwind-v3-era `[--var]` bracket syntax kept as-is — see Behavior changes).
    - Everything else (`z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none`) untouched.
- Leftover sweep: `grep -n "radix-ui\|@radix-ui\|IconPlaceholder" src/components/ui/popover.tsx` → empty. Formatted with oxfmt (tabs + double quotes), passes.

## Left alone
- `src/components/ui/combobox.tsx` — the only consumer. Out of scope for this task (separate component/agent). NOTE for its migration: it uses `<PopoverTrigger asChild>` (must become `render={<Button .../>}`; Base UI Trigger has no `asChild`, so it is broken until that file is migrated) and `PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0"` (must become `w-[var(--anchor-width)]`; the var now lives on the Positioner and inherits into the Popup).
- `PopoverAnchor`: the user's wrapper never exported it and nothing in `src/` references it (grep clean), so no inert passthrough was needed. If ever needed, Base UI has no Anchor part — pass `anchor` to the Positioner.
- Base UI-only parts (Close, Arrow, Backdrop, Title, Description, Viewport) not added — wrapper keeps its original export surface: `Popover`, `PopoverTrigger`, `PopoverContent`.

## Behavior changes
- Animation engine changed from tw-animate keyframes (`animate-in`/`animate-out`) to CSS transitions driven by Base UI's `data-starting-style`/`data-ending-style` (default 150ms transition timing instead of keyframe easing). Same visual intent (fade + 95% zoom + 0.5rem per-side slide-in), but exit now also gets the scale/fade transition symmetrically via ending-style; slide remains enter-only, as before.
- `onOpenChange` on `Popover` (Root) now has the Base UI signature `(open, eventDetails) => void`; Radix per-interaction callbacks (`onEscapeKeyDown`, `onPointerDownOutside`, `onFocusOutside`, `onInteractOutside`) no longer exist on Content — no in-repo consumer passes any of these today.
- Base UI Portal renders a wrapper `<div>` (Radix rendered none) and the Positioner is a new `<div>` between portal and popup — DOM depth changes; `z-50` kept on both Positioner and Popup.
- Pre-existing quirk carried over, not fixed: `origin-[--transform-origin]` uses Tailwind v3 var-shorthand brackets, which Tailwind v4 does not resolve (the class was already dead before the migration under this repo's Tailwind v4). Renamed the var only; switching to `origin-(--transform-origin)` would *add* styling that wasn't active before, i.e. a restyle.
- Positioner defaults that differ subtly from Radix when consumers override props: `collisionPadding` default is 5 (Radix 0), collision avoidance is always-on object-config instead of `avoidCollisions` boolean. No consumer passes these.

## Verify by hand
1. `pnpm dev`, open an admin page using the combobox (e.g. a posts filter) — after combobox.tsx is migrated too, the popover must open under the trigger, width matching the trigger, no mispositioning at viewport edges (flip when near bottom).
2. Open the popover: content fades/zooms in from 95% with a slight upward/downward slide matching the side; close: fades/zooms out.
3. Keyboard: Esc closes; focus returns to the trigger. Click outside closes.
4. Pass `side="top"` / `align="start"` / `sideOffset={10}` ad hoc on a `PopoverContent` and confirm the popup actually moves (proves the Positioner forwarding — if it doesn't move, props are leaking onto the Popup).
5. Check the DOM in devtools: `<div>` portal wrapper → positioner div (`isolate z-50`) → popup div with `data-open` when open.
