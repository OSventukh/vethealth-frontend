# scroll-area

2026-07-06 — strategy: transformation engine (legacy default style). Verdict: pristine wrapper (matched shadcn default golden byte-for-byte modulo oxfmt formatting), migrated cleanly to `@base-ui/react/scroll-area`; zero consumers in the codebase.

## Changed

- `src/components/ui/scroll-area.tsx` — the only file touched.
  - Import: `* as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"` → `{ ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area"` (line 3).
  - Part renames: `ScrollAreaScrollbar` → `Scrollbar` (line 30), `ScrollAreaThumb` → `Thumb` (line 43). `Root`, `Viewport`, `Corner` map 1:1.
  - Types: `React.ElementRef<typeof …>` → `React.ComponentRef<typeof …>` (React 19 deprecation of ElementRef) and `React.ComponentPropsWithoutRef<typeof …>` → `ScrollAreaPrimitive.Root.Props` / `ScrollAreaPrimitive.Scrollbar.Props` (lines 9–10, 27–28), verified against `node_modules/@base-ui/react/scroll-area/*/**.d.ts` (namespace `Props` types exist on both parts).
  - `displayName` now string literals `"ScrollArea"` / `"ScrollBar"` (lines 24, 46): Base UI sets part `displayName` only when `NODE_ENV !== "production"`, so mirroring the old `Primitive.X.displayName` pattern would be `undefined` in prod builds.
  - All Tailwind classes preserved exactly; no `data-[state=…]` or `--radix-*` hooks existed in the classNames, so no class-mapping rewrites were needed.
  - Leftover scan: `grep -n "radix-ui\|@radix-ui\|IconPlaceholder"` on the file → empty. Formatted with oxfmt (tabs + double quotes).

## Left alone

- No consumers: `grep -rn "<ScrollArea\|<ScrollBar"` across `src/` finds none outside the wrapper itself — the component is currently unused, so no call sites to audit for dropped Radix props (`type`, `scrollHideDelay`, `dir`, `nonce`, `forceMount`).
- `@radix-ui/react-scroll-area` left in `package.json` — dependency cleanup is a separate, whole-migration step (other wrappers are being migrated in parallel).

## Behavior changes

- **Scrollbar visibility semantics differ.** Radix Root defaulted to `type="hover"` + `scrollHideDelay=600` (scrollbar appears on hover, hides after a delay). Base UI drops both props: the Scrollbar mounts whenever the viewport is scrollable and, with this wrapper's styling (no opacity rules keyed on `data-hovering`/`data-scrolling`), it is **always visible** while there is overflow. Reproducing hover-show/auto-hide requires CSS against `data-hovering`/`data-scrolling` — not silently added.
- Radix-only props (`type`, `scrollHideDelay`, `dir`, `nonce` on Root; `forceMount` on Scrollbar — Base UI's rename is `keepMounted`) no longer exist in the prop types. No consumers today, so nothing breaks now, but future call sites copy-pasted from Radix examples will type-error.
- Base UI recommends a `ScrollArea.Content` wrapper inside Viewport for correct **horizontal** overflow measurement; the shadcn shape omits it. Vertical scrolling (the common case) is unaffected; a horizontal `<ScrollBar orientation="horizontal" />` use may need `Content` added later.
- Scrollbar `data-state="visible|hidden"` attribute is gone (Base UI uses `data-hovering`/`data-scrolling`/`data-has-overflow-*`); no styles in this project referenced it.

## Verify by hand

1. Drop `<ScrollArea className="h-40 w-64 rounded border">…tall content…</ScrollArea>` into any page (it has no current consumers), `pnpm dev`.
2. Confirm content clips and scrolls with the wheel/trackpad; native scrollbar hidden, custom 2.5-width thumb visible on the right.
3. Drag the thumb — viewport follows; thumb uses `bg-border` rounded styling.
4. Note the scrollbar is persistently visible while content overflows (expected delta vs Radix hover-only — see Behavior changes).
5. Shrink content below the container height — scrollbar unmounts (Base UI "auto" behavior).
6. Optional: `<ScrollBar orientation="horizontal" />` with wide content — check thumb sizing; if off, wrap children in `ScrollAreaPrimitive.Content`.
