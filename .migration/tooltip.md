# tooltip

2026-07-11, strategy: transformation engine (legacy `default` style). Verdict: migrated to `@base-ui/react/tooltip`.

## Changed

- `src/components/ui/tooltip.tsx` — rewired `@radix-ui/react-tooltip` → `@base-ui/react/tooltip`.
  - `TooltipProvider = Tooltip.Provider`, `Tooltip = Tooltip.Root` (bare re-exports).
  - `TooltipTrigger` is now an `asChild`-compat shim (forwardRef, `HTMLButtonElement`): `asChild` → Base `render={child}`, else renders the default `<button>`. Two consumers pass `asChild`.
  - `TooltipContent` (Radix `Content`) → `Portal > Positioner > Popup`. `side`/`align`/`alignOffset`/`sideOffset` (`sideOffset = 4`) moved onto the `Positioner`; `isolate z-50` on the Positioner, `z-50` kept on the Popup.
  - Animation classes converted from tailwindcss-animate `data-[state=closed]:animate-out fade/zoom/slide` to Base's transition model: `transition-[translate,scale,opacity]` + `data-starting-style:`/`data-ending-style:` (opacity + scale-95 + per-`data-[side]` translate) + `origin-[--transform-origin]`. Same fade/zoom/slide feel, no keyframe utilities.

Leftover scan: clean.

## Consumers swept

None needed structural edits — the wrapper API is preserved:
- `admin/components/layout/Navigation/index.tsx` — `<TooltipProvider>` (no props), `<TooltipContent side={…}>`; works as-is.
- `admin/components/Editor/ParsedContent/index.tsx` and `Editor/Lexical/nodes/TooltipComponent.tsx` — `<TooltipTrigger asChild>` handled by the shim.
- `components/ui/sidebar.tsx` — `<TooltipProvider delayDuration={0}>` → `delay={0}` (Base renamed the prop). See `sidebar.md`.

## Behavior changes

- Provider timing prop renamed: Radix `delayDuration`/`skipDelayDuration` → Base `delay`/`closeDelay` (default 600 → Base default differs; only sidebar set it explicitly, to 0).
- No `Arrow` was added (the Radix wrapper had none).

## Verify by hand

1. Admin sidebar collapsed to icons — hover a menu button; a tooltip appears to the right after the (0ms) delay.
2. Editor toolbar / parsed-content tooltips — hover the trigger; content shows, positioned per `side`.
3. Keyboard focus onto a trigger also opens the tooltip; Escape/blur closes it.
4. Confirm no layout shift and correct side-flip near viewport edges (Base collision handling).
