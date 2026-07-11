# dialog

2026-07-06 — strategy: transformation engine (legacy default style, no base-default registry item). Verdict: pristine shadcn wrapper (only oxfmt formatting / Tailwind-v4 class-order drift vs golden), migrated cleanly to `@base-ui/react/dialog` with identical exports and prop shapes.

## Changed

- `src/components/ui/dialog.tsx` — the only file touched.
  - Import (`dialog.tsx:3`): `import * as DialogPrimitive from "@radix-ui/react-dialog"` → `import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"`.
  - Part renames per overlays.md: `Overlay` → `Backdrop` (`dialog.tsx:21`), `Content` → `Popup` (`dialog.tsx:38`). Centered modal, so NO Positioner (per universal-patterns.md). `Root`/`Trigger`/`Portal`/`Close`/`Title`/`Description` map 1:1. Composition kept: `DialogContent` = `Portal > DialogOverlay > Popup` with the built-in `X` close button.
  - Types: kept the `React.forwardRef<React.ElementRef<...>, React.ComponentPropsWithoutRef<...>>` shape — Base UI parts are `ForwardRefExoticComponent`s (verified in `node_modules/@base-ui/react/dialog/backdrop/DialogBackdrop.d.ts`), so refs and prop inference keep working and all ten exported names keep shadcn-compatible prop shapes.
  - `displayName` assignments switched from `DialogPrimitive.X.displayName` to string literals (`"DialogOverlay"` etc., e.g. `dialog.tsx:30`) — Base UI sets displayName only in dev builds, so copying it would be `undefined` in prod (and would read "DialogBackdrop" instead of "DialogOverlay" anyway).
  - Class rewrites (class-mapping.md animation idiom — animate-in/out restated, not translated 1:1):
    - Overlay (`dialog.tsx:24`): `data-[state=open]:animate-in data-[state=closed]:animate-out fade-in/out-0` → `transition-opacity data-starting-style:opacity-0 data-ending-style:opacity-0` (Tailwind `transition-*` default duration 150ms ≈ old animate-in default).
    - Popup (`dialog.tsx:41`): fade+zoom+slide keyframes → `transition-all duration-200 data-starting-style:opacity-0 data-starting-style:scale-95 data-ending-style:opacity-0 data-ending-style:scale-95` (existing `duration-200` kept; static `translate-x/y-[-50%]` centering kept).
    - Close button (`dialog.tsx:47`): mechanical `data-[state=open]:` → `data-open:` rename on `bg-accent`/`text-muted-foreground`.
  - All other Tailwind classes preserved byte-for-byte (user's oxfmt/Tailwind-v4 variants like `focus:outline-hidden` untouched).
- Leftover sweep: `grep -n "radix-ui\|@radix-ui\|IconPlaceholder" src/components/ui/dialog.tsx` → empty (exit 1). oxfmt run: no reformat needed.

## Left alone

- `src/components/ui/command.tsx` — imports `Dialog`/`DialogContent` from this file; export names and prop shapes unchanged, so it keeps compiling. Its own migration is a separate task.
- `src/components/ui/sheet.tsx` — builds on the same Radix dialog primitive but is its own wrapper file; separate migration task.
- Consumers (`src/app/(dashboard)/admin/{pages,categories,posts,topics,users}/columns.tsx`) — grep confirmed none pass Radix-only props (`forceMount`, `onOpenAutoFocus`, `onCloseAutoFocus`, `onEscapeKeyDown`, `onPointerDownOutside`, `onInteractOutside`); no changes needed.
- `@radix-ui/react-dialog` left in package.json — sheet.tsx (and possibly others) still import it until their migrations land.

## Behavior changes

- Animations are now CSS transitions on `data-starting-style`/`data-ending-style` instead of tw-animate keyframes. The Radix "slide from top-[48%]" nuance on open/close is dropped — the popup now fades + zooms (scale 95%→100%) in place, matching the shadcn base-registry dialog. Overlay fade is ~150ms (Tailwind transition default) vs animate-in's 150ms — effectively unchanged.
- `data-open:bg-accent data-open:text-muted-foreground` on the built-in close button is inert: Base UI's `Dialog.Close` does not emit `data-open` (it only emits `data-disabled`). This styling was already questionable under Radix (Radix `Dialog.Close` documents no `data-state` either); kept as a mechanical rename rather than silently deleted.
- Base UI `Portal` renders a wrapper `<div>` in the DOM (Radix portal rendered children directly). Cosmetic DOM difference; no styles target it.
- For consumers that later pass callbacks: `onOpenChange` now receives `(open, eventDetails)` — existing `(open) => void` handlers remain type- and runtime-compatible. Radix per-interaction dismiss props no longer exist on Content (none were used in this codebase).
- Radix put initial focus per its own heuristics; Base UI focuses the first tabbable element in the popup by default and exposes `initialFocus`/`finalFocus` on Popup — passed through via `{...props}` on `DialogContent`.

## Verify by hand

1. `pnpm dev`, log in, open `/admin/posts` (or any admin table) and trigger a row's delete/edit dialog from the actions column.
2. Dialog opens centered, dimmed black/80 backdrop fades in, panel fades/zooms in (~200ms); no jump to a corner (would indicate broken translate centering).
3. Press Escape → closes with fade-out. Click the backdrop → closes. Click the X button (top-right) → closes; X shows hover opacity change and a focus ring when tabbed to.
4. Tab through: focus stays trapped inside the dialog; on close, focus returns to the trigger.
5. Body scroll is locked while open; unlocked after close.
6. Open the command palette (command.tsx builds on DialogContent) and confirm it still renders inside the dialog shell without layout regressions.
