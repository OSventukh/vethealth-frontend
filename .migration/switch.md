# switch

2026-07-06 — strategy: transformation engine (legacy default style). Verdict: clean 1:1 migration (`@radix-ui/react-switch` → `@base-ui/react/switch`), user classes preserved verbatim modulo the mandated data-attribute rewrites.

## Changed

- `src/components/ui/switch.tsx` (only file touched):
  - Classification vs the shadcn default golden (`/r/styles/default/switch.json`): **pristine in substance** — same utility set; the only drift is Tailwind-v4 class ordering and `focus-visible:outline-none` → `focus-visible:outline-hidden` (project-wide TW4 rename), no user-added classes, exports, or logic. All user classes kept as-is.
  - switch.tsx:3 — import rewired: `import * as SwitchPrimitives from "@radix-ui/react-switch"` → `import { Switch as SwitchPrimitives } from "@base-ui/react/switch"` (namespace → named import per universal-patterns). Local alias kept so `Root`/`Thumb` usage and the `forwardRef` type params (`React.ElementRef` / `ComponentPropsWithoutRef` of `SwitchPrimitives.Root`) are unchanged — verified against `node_modules/@base-ui/react/switch/root/SwitchRoot.d.ts` (`ForwardRefExoticComponent<... & RefAttributes<HTMLElement>>`, `SwitchRootProps`).
  - switch.tsx:14 — Root className: `data-[state=checked]:bg-primary` → `data-checked:bg-primary`, `data-[state=unchecked]:bg-input` → `data-unchecked:bg-input`; `disabled:cursor-not-allowed disabled:opacity-50` → `data-disabled:*` (Base UI Root renders `<span>`, so `:disabled` variants are dead code per class-mapping.md "Element changes kill pseudo-class variants").
  - switch.tsx:22 — Thumb className: `data-[state=checked]:translate-x-5` → `data-checked:translate-x-5`, `data-[state=unchecked]:translate-x-0` → `data-unchecked:translate-x-0`.
  - `focus-visible:*` classes kept untouched: verified in `SwitchRoot.js` that the root span is the focus target (hidden input has `tabIndex: -1` and its `onFocus` redirects to the span), so the ring still renders.
  - Exported name (`Switch`), forwardRef shape, and prop surface stay shadcn-compatible; `displayName` assignment kept (Base UI sets `SwitchRoot.displayName` in dev builds).
  - Leftover sweep: `grep -n "radix-ui\|@radix-ui\|IconPlaceholder" src/components/ui/switch.tsx` → **empty**. `pnpm exec oxfmt` run, no reformat needed (tabs + double quotes already).

## Left alone

- `package.json` — `@radix-ui/react-switch` dependency NOT removed: other agents are migrating files in parallel; dependency pruning should happen once in a final sweep. This file was its only consumer (`grep -rl "components/ui/switch"` → 2 admin consumers of the wrapper, none import radix directly).
- `src/app/(dashboard)/admin/categories/components/EditCategory.tsx` and `src/app/(dashboard)/admin/topics/components/EditTopic/index.tsx` — the only consumers; they pass `checked` + `onCheckedChange={setIsShowParent}` (`(boolean) => void`), which stays type/runtime-compatible (Base UI's extra `eventDetails` arg is simply ignored). No app-level `peer-data-[state=*]`/switch-targeting selectors found.

## Behavior changes

- **Rendered element changes `<button role="switch">` → `<span role="switch">` + always-rendered hidden `<input type="checkbox">`.** Any CSS/tests selecting `button` for the switch, or form logic relying on no input being present outside a form, would notice. Keyboard/focus behavior is preserved by Base UI's `useButton` on the span.
- `disabled:` Tailwind variants replaced by `data-disabled:` (visual parity preserved; the native `disabled` attribute no longer exists on the root element).
- `onCheckedChange` now receives `(checked, eventDetails)`; existing single-arg callbacks keep working.
- Base UI adds attributes Radix lacked (`data-readonly`, `data-required`, Field attrs) — inert unless styled.

## Verify by hand

1. `pnpm dev`, log into `/admin`, open a topic edit page (Топіки → edit) — the "Батьківська тема" switch is in the form label row.
2. Click the switch: track flips `bg-input` ↔ `bg-primary`, thumb slides right 20px (`translate-x-5`); the parent-topic Select appears/disappears.
3. Keyboard: Tab to the switch — focus ring (2px ring + offset) must appear on the pill; Space toggles it.
4. Clicking the surrounding label text also toggles the switch (hidden-input label association).
5. Devtools: root is `<span role="switch">` with `data-checked`/`data-unchecked` toggling; no console errors.
