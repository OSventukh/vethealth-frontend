# navigation-menu

2026-07-11, strategy: transformation engine (legacy `default` style). Verdict: migrated to `@base-ui/react/navigation-menu`. No consumers in the project — migrated to drop the Radix dependency; carries one flagged behavior gap (Indicator).

## Changed

- `src/components/ui/navigation-menu.tsx` — `@radix-ui/react-navigation-menu` → `@base-ui/react/navigation-menu`.
  - `NavigationMenu` (Root): now a plain function component (Base `Root` is a generic callable with no ref slot). Still renders children + `<NavigationMenuViewport/>`.
  - `NavigationMenuList`/`Item`/`Trigger`/`Content`/`Link` mapped to the Base parts (`Item`, `Link` are bare re-exports).
  - `NavigationMenuViewport`: the single Radix `Viewport` (rendered below the list) becomes the Base anchored chain **`Portal > Positioner > Popup > Viewport`**. CSS vars remapped: `--radix-navigation-menu-viewport-width/height` (on Viewport) → `--popup-width`/`--popup-height` (on **Popup**). Open/close animation → `data-starting-style:`/`data-ending-style:` on the Popup.
  - `navigationMenuTriggerStyle` cva: `data-[state=open]:bg-accent/50` → `data-popup-open:bg-accent/50`. Trigger chevron `group-data-[state=open]:rotate-180` → `group-data-popup-open:rotate-180`.
  - `NavigationMenuContent` motion classes `data-[motion=from-start]:slide-in-from-left-52` etc. → `data-[activation-direction=left|right]:slide-in-from-…` (Base exposes `data-activation-direction`).

Leftover scan: clean.

## Left alone

- No app code imports `navigation-menu` (verified by grep), so there was no consumer sweep.

## Behavior changes (FLAGGED, not patched)

- **Indicator has no Base equivalent.** Radix's `Indicator` was a pointer that tracked the active trigger *below the list*. Base UI has no such part; its `Icon` is a chevron *inside the Trigger*. `NavigationMenuIndicator` is kept for export-compatibility, mapped onto `NavigationMenu.Icon` with an in-file `// FLAG` comment — it no longer tracks the active trigger. Harmless while the component is unused.
- Positioning model changed from Radix's below-the-list viewport to Base's real collision-aware `Positioner` (anchored to the active trigger, `sideOffset={6}`).
- `delayDuration` (200) → `delay` (Base default 50); `skipDelayDuration` dropped.

## Verify by hand

Currently unused, so no live surface. If adopted later: render a `NavigationMenu` with a `NavigationMenuTrigger showArrow` + `NavigationMenuContent`, then confirm (1) hovering the trigger opens the anchored popup with a rotating chevron, (2) the popup animates in/out, (3) `NavigationMenuLink` items navigate, (4) re-evaluate whether an active-trigger indicator is still wanted (would need a custom implementation).
