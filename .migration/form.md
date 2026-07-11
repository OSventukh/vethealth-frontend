# form

2026-07-11, strategy: transformation engine (legacy `default` style). Verdict: migrated — react-hook-form kept; Radix `Slot` + `Label` typings replaced with Base UI.

## Changed

- `src/components/ui/form.tsx`
  - Removed `import { Slot } from "@radix-ui/react-slot"` and `import type * as LabelPrimitive from "@radix-ui/react-label"`.
  - Added `import { useRender } from "@base-ui/react/use-render"`.
  - `FormControl`: Radix `<Slot>` (which merged injected `id`/`aria-*`/`ref` onto its single child) → Base `useRender({ render: children, ref, props: { id, aria-describedby, aria-invalid, …props } })`. This is the idiomatic Base replacement for a standalone Slot — `useRender` merges the props (and ref) onto the consumer's child element exactly as Slot did.
  - `FormLabel`: retyped from `React.ElementRef<typeof LabelPrimitive.Root>` / `ComponentPropsWithoutRef<typeof LabelPrimitive.Root>` to `React.ComponentRef<typeof Label>` / `ComponentPropsWithoutRef<typeof Label>`, where `Label` is the already-migrated native-`<label>` wrapper. Renders the same `<Label htmlFor={formItemId}>`.
  - Everything else (`Form`, `FormField`, `FormItem`, `FormDescription`, `FormMessage`, `useFormField`, the two contexts) unchanged.

Leftover scan: clean. `react-hook-form` is not Radix and is untouched.

## Consumers swept

All 7 consumers use the wrapper API unchanged (`FormField`/`FormItem`/`FormLabel`/`FormControl`/`FormMessage`): `auth/components/{Forgot,Confirmation,SignIn}.tsx`, `admin/{topics/EditTopic, categories/EditCategory, users/EditUser, users/EditPassword}`. No edits required.

## Behavior changes

- `FormControl` no longer renders a Radix `Slot` internally, but the merge semantics (child element receives `id` = `${id}-form-item`, `aria-describedby`, `aria-invalid`, and the forwarded ref) are equivalent. Base `useRender` merges `className`/`style`/event handlers the same way Slot did.
- Pre-existing oxlint `jsx-no-constructed-context-values` warnings on the two `Context.Provider value={…}` remain (they were in the original file too — not introduced here).

## Verify by hand

1. Any admin edit form (e.g. Edit Category): the label's `htmlFor` matches the input `id`; clicking the label focuses the input.
2. Trigger a validation error (submit empty required field) — the input gets `aria-invalid`, the label turns `text-destructive`, and `FormMessage` shows the error text with the right `aria-describedby` wiring.
3. Submit a valid form — no console warnings about refs; the field value posts correctly.
