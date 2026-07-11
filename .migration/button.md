# button

2026-07-06, strategy: transformation engine (legacy default style) — migrated the customized shadcn button from `@radix-ui/react-slot` to the real `@base-ui/react/button` primitive; all user customizations preserved.

## Changed

- `src/components/ui/button.tsx` — the only file touched.
  - Classification vs golden (`https://ui.shadcn.com/r/styles/default/button.json`): **customized**. User deltas all preserved verbatim: extra `success` variant (line 13), `hover:opacity-90` on the `default` variant (line 12, golden uses `hover:bg-primary/90`), no `gap-2`/`[&_svg]:*` utilities in the base string, and `focus-visible:outline-hidden` (Tailwind v4 idiom) instead of golden's `outline-none` (line 8).
  - Import swap (line 1): `import { Slot } from "@radix-ui/react-slot"` → `import { Button as ButtonPrimitive } from "@base-ui/react/button"` (real primitive per the hard rule — no hand-rolled useRender wrapper).
  - `ButtonProps` (lines 37-47): now extends `Omit<ButtonPrimitive.Props, "className"> & VariantProps<typeof buttonVariants>` with `className?: string` re-narrowed (Base UI allows state-callback classNames; consumers pass strings). `asChild?: boolean` kept as a Radix-compat shim; Base UI's `render`/`nativeButton`/`focusableWhenDisabled` flow through untouched.
  - Render path (lines 49-76): `const Comp = asChild ? Slot : "button"` → `<ButtonPrimitive>`; `asChild` maps to `render={React.Children.only(children)}` + `nativeButton={false}` (lines 51-64), with `{...props}` spread last so an explicit `render`/`nativeButton` from a caller wins. Public ref type stays `HTMLButtonElement` (internal cast to `React.Ref<HTMLElement>`, Base UI's ref type).
  - Zero className rewrites needed: the cva strings contain no `data-[state=*]` selectors and no `--radix-*` vars (checked against class-mapping.md).
  - Verified: `oxfmt` applied; `oxlint` clean; isolated `tsc --noEmit` on just this file exits 0; **leftover scan clean** — `grep -n "radix-ui\|@radix-ui\|IconPlaceholder" src/components/ui/button.tsx` returns nothing.

## Left alone

- `src/components/ui/icon-button.tsx` — plain native `<button>`, no Radix; out of scope.
- All 20+ `Button` consumers (`auth/components/*`, `admin/**/columns.tsx`, `admin/**/Edit*`, `sidebar.tsx`, `DataTable/TablePagination.tsx`, `ImageUpload`, `NotFound/Return`) — API kept shadcn-compatible (`Button`, `buttonVariants`, `ButtonProps`, `asChild` all still exported/accepted), so no consumer edits needed.
- Other `ui/*` wrappers that place `<Button>` inside their own `asChild`/`render` triggers — owned by parallel agents.
- `package.json` — `@radix-ui/react-slot` may still be used by other wrappers mid-migration; dependency removal is a final-pass concern, not this component's.

## Behavior changes

1. **Default `type` attribute**: Base UI's `useButton` injects `type="button"` when no `type` is given; a native `<button>` inside a form defaults to `type="submit"`. Explicit `type` props still win (merged last in Base UI). Audited every `<Button>` inside a `<form>` (SignIn, Forgot, Confirmation, EditCategory, EditPassword, EditUser, EditTopic) — all already pass `type="submit"`, so nothing breaks today; but any future button relying on implicit submit will silently stop submitting the form.
2. **`asChild` semantics**: now `render` + `nativeButton={false}`, so a non-button target (e.g. a `Link`/`<a>`) gains `role="button"`, `tabIndex={0}` and Space/Enter keyboard activation — Radix `Slot` added none of these. No `<Button asChild>` usage exists in the codebase today (grepped), so this is latent, not live.
3. **Disabled clicks**: Base UI additionally guards `onClick` when `disabled` and exposes `data-disabled`; with the default `nativeButton={true}` the real `disabled` attribute still renders, so existing `disabled:*` Tailwind variants keep working. Net-neutral for current usage.

## Verify by hand

1. `pnpm dev`, open `/auth/signin` — the "Увійти" button submits the form (explicit `type="submit"` path) and shows the default variant with `hover:opacity-90`.
2. In `/admin` (any table, e.g. topics), open a row's delete dialog — "Видалити" renders the `destructive` variant, "Скасувати" the default; both close/act correctly.
3. In an admin edit form (e.g. Edit Category) confirm the green `success` variant button submits.
4. Inspect a rendered button in devtools: it is a real `<button type="button">` (or `type="submit"` where passed), with the exact same class string as before.
5. Tab to any button and check the focus ring (`focus-visible:ring-2`) still appears; a `disabled` button is skipped and shows 50% opacity.
