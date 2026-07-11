# label

2026-07-06 — strategy: transformation engine (legacy default style). Verdict: migrated cleanly; Radix label primitive replaced with a native `<label>` per the hard rule (Base UI has no Label primitive).

## Changed

- `src/components/ui/label.tsx` — the only file touched.
  - Classification: **pristine** — the pre-migration file was byte-equivalent to the shadcn default-style golden (`https://ui.shadcn.com/r/styles/default/label.json`) modulo formatting only (tabs/double quotes/import order from oxfmt). No custom classes, exports, or logic to preserve beyond the stock ones.
  - Removed `import * as LabelPrimitive from "@radix-ui/react-label"`; no Base UI import added — Base UI ships no standalone Label, so the wrapper now renders a native `<label>` (label.tsx:16), per wrapper-shapes.md ("Label: no primitive; native `<label>`") and universal-patterns.md ("Label primitive -> native `<label>`").
  - Ref/prop generics retyped from `typeof LabelPrimitive.Root` to `HTMLLabelElement` / `React.ComponentPropsWithoutRef<"label">` (label.tsx:12-14). Since Radix Label's props were the native label props plus `asChild` (unused anywhere in this repo — grep confirmed), the exported `Label` prop shape stays shadcn-compatible for all consumers, including `form.tsx`'s `FormLabel` spread.
  - `labelVariants` cva string kept byte-for-byte (label.tsx:9) — no class-mapping rewrites needed (no data-attribute or CSS-var selectors in it).
  - `displayName` changed from `LabelPrimitive.Root.displayName` to the literal `"Label"` (label.tsx:18).
  - Formatted with `pnpm exec oxfmt src/components/ui/label.tsx` (tabs + double quotes) and re-read to confirm.
  - Leftover scan clean: `grep -n "radix-ui\|@radix-ui\|IconPlaceholder" src/components/ui/label.tsx` → no matches.

## Left alone

- `src/components/ui/form.tsx` — imports `Label` and also references `@radix-ui/react-label` **types** for `FormLabel`'s generics. That is form's own migration scope (separate agent/component); the new native-label `Label` remains assignment-compatible with it in the meantime, so nothing breaks.
- Consumers `admin/posts/components/EditPost/index.tsx`, `admin/pages/components/index.tsx`, `admin/components/Editor/Lexical/plugins/TooltipPlugin/InsertTooltipDialog.tsx` — use `<Label htmlFor/className/children>` only; no Radix-specific props (`asChild` not used anywhere), so no changes needed.
- `@radix-ui/react-label` left in `package.json` — form.tsx still type-imports it; dependency removal belongs to the final cleanup pass after all components migrate.

## Behavior changes

- **Double-click text selection**: Radix's `Label.Root` prevented text selection when rapidly double-clicking the label (it `preventDefault()`s on repeated mousedown). A native `<label>` does not — double-clicking a label now selects its text. Purely cosmetic; flagged, not patched (could be restored with a small `onMouseDown` handler if ever wanted).
- `Label.displayName` is now `"Label"` instead of Radix's `"Label"` via `LabelPrimitive.Root.displayName` — same effective value, no observable change; listed only for completeness.

## Verify by hand

1. `pnpm dev`, open an admin form that uses labels (e.g. `/admin/posts` → edit a post).
2. Confirm labels render with the same size/weight (`text-sm font-medium leading-none`).
3. Click a label with `htmlFor` pointing at an input — focus must move to the input (native label association).
4. Pair a label after a disabled peer input (form.tsx usage) — label should show `cursor-not-allowed` + dimmed via `peer-disabled:*`.
5. Double-click a label — text now selects (expected new behavior, see above).
