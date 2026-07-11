# sheet

2026-07-11, strategy: transformation engine (legacy `default` style). Verdict: migrated — Radix `Dialog` (side variants) → `@base-ui/react/dialog`.

## Changed

- `src/components/ui/sheet.tsx` — `@radix-ui/react-dialog` → `@base-ui/react/dialog` (`Dialog as SheetPrimitive`).
  - `Overlay` → `Backdrop`; `Content` → `Popup`; `Title`/`Description` unchanged names.
  - `SheetTrigger` and `SheetClose` are `asChild`-compat shims (`render={child}` when `asChild`). Consumers use `<SheetClose asChild>` and plain `<SheetTrigger className=…>`.
  - `sheetVariants` (cva) side animations converted: Radix `data-[state=open]:animate-in slide-in-from-<side>` / `data-[state=closed]:slide-out-to-<side>` → Base `transition ease-in-out` + `data-starting-style:`/`data-ending-style:` per-side translates (`-translate-x-full`/`translate-x-full`/`-translate-y-full`/`translate-y-full`). Asymmetric duration preserved via base `duration-500` + `data-ending-style:duration-300`.
  - Overlay uses `transition-opacity` + `data-starting-style:opacity-0 data-ending-style:opacity-0`.
  - Built-in close button `data-[state=open]:bg-secondary` → `data-open:bg-secondary`.
  - **Preserved the project customization** `showOverlay?: boolean` on `SheetContentProps` (renders `<SheetOverlay/>` conditionally).

Leftover scan: clean.

## Consumers swept

- `(public)/components/Navigation/Search/index.tsx` and `Navigation/Mobile/index.tsx`: the `@radix-ui/react-visually-hidden` `<VisuallyHidden asChild><SheetTitle/></VisuallyHidden>` wrappers → `<SheetTitle className="sr-only">…</SheetTitle>` (Base has no VisuallyHidden; `sr-only` is the documented replacement). Radix VH import removed from both.
- `admin/pages/components/index.tsx`: `<SheetContent showOverlay={false}>` — custom prop retained; no change.

## Behavior changes

- Base `Dialog.Popup` is focus-trapped/modal like Radix; the `side` positioning is pure CSS (fixed inset + translate), unchanged visually.
- In Navigation/Search the `<SheetTitle>` sits between trigger and content (as before); it registers the dialog's accessible name via context and is visually hidden by `sr-only`.

## Verify by hand

1. Public site mobile (`sm` width): tap the hamburger — sheet slides in from the **left**; tap search — sheet slides from the **top**. Both animate in/out.
2. Accessible name: screen reader announces "Меню" / "Пошук" though visually hidden.
3. Admin post editor settings sheet (`showOverlay={false}`) — opens from the right with **no** dimmed backdrop; page behind stays interactive-looking.
4. `SheetClose` buttons (asChild) close the sheet; Escape + backdrop click (when overlay present) also close.
5. Focus returns to the trigger on close.
