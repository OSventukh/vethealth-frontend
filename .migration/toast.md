# toast

2026-07-11, strategy: transformation engine (legacy `default` style), coordinated 3-file migration. Verdict: **migrated** to `@base-ui/react/toast`. (Supersedes the earlier report that flagged toast as blocked.)

The earlier analysis was right that Base UI Toast is manager-driven and cannot be fed by shadcn's external `use-toast` reducer. The resolution was to migrate all three files together, using Base's **module-level manager** (`createToastManager`) so the public `toast()` / `useToast()` API the 11 admin consumers rely on is preserved.

## Changed

- `src/components/ui/toast.tsx` — `@radix-ui/react-toast` → `@base-ui/react/toast` (`Toast as ToastPrimitives`).
  - `ToastProvider = Toast.Provider`.
  - `ToastViewport` now wraps `Toast.Portal > Toast.Viewport` (Base portals the viewport to `<body>`); classes preserved (`z-100`, mobile-top/desktop-bottom).
  - `Toast` = `Toast.Root` wrapper; **keeps the project's custom `success` variant** and `variant` cva. `Toast.Root` requires a `toast` prop (the toast object) — supplied by the Toaster.
  - `ToastAction`/`ToastClose`/`ToastTitle`/`ToastDescription` mapped to the Base parts; all classes (incl. `group-[.destructive]`/`group-[.success]` hooks and the custom success styling) preserved. Radix's `toast-close=""` attribute dropped (Base doesn't use it).
  - `toastVariants` swipe/animation converted: `data-[state=open]:animate-in slide…` / `data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]` → Base `data-starting-style:`/`data-ending-style:` transitions + `data-[swiping]:translate-x-[var(--toast-swipe-movement-x)]`.
- `src/components/ui/use-toast.ts` — rewritten. The react-hot-toast-style reducer/store is gone. Now:
  - `const toastManager = Toast.createToastManager<ToastData>()` (module-level; `ToastData = { variant?, action? }`).
  - `toast({ title, description, variant, action, duration })` → `toastManager.add({ title, description, timeout: duration, data: { variant, action } })`, returning `{ id, dismiss, update }` (same shape as before).
  - `useToast()` returns `{ toast, dismiss }` — **no hook/Provider ancestor required** (consumers call it in components that are not under `<Toast.Provider>`).
  - Exports `toastManager` + `type ToastData` for the Toaster.
- `src/components/ui/toaster.tsx` — rewritten. `Toast.Provider toastManager={toastManager}` wires the module-level manager; an inner `ToastList` reads `Toast.useToastManager().toasts` and maps each into `<Toast toast={t} variant={t.data.variant}>` inside `ToastViewport`. `variant`/`action` are read back from `toast.data`.

Leftover scan (`grep -n "radix-ui" src/components/ui/{toast.tsx,use-toast.ts,toaster.tsx}`): clean.

## Left alone

- 11 admin consumers of `useToast`/`toast` (`admin/**`: layout, categories/users/posts/pages columns + edit components, EditTopic). All call `const { toast } = useToast(); toast({ variant, description, title })` — verified none read `toasts` or pass `action`/`duration`, so the preserved API needed **zero consumer edits**.

## Behavior changes (idiomatic Base, flagged)

- Open-state model is now manager-owned (`add`/`close`/`update`) instead of shadcn's dismiss-then-remove reducer. `TOAST_LIMIT = 1` (shadcn) → Base Provider default `limit = 3`; `TOAST_REMOVE_DELAY` (∞) → Base `timeout` default 5000 (auto-dismiss). If single-at-a-time / no-auto-dismiss behavior is desired, set `<Toast.Provider limit={1} timeout={0}>`.
- Toasts now auto-dismiss after ~5s (they previously stayed until closed). Hover pauses the timer (Base default).
- `Toast.Title` renders `<h2>`, `Description` renders `<p>` (were div-ish under Radix). Styling unaffected.
- Swipe-to-dismiss uses Base's model (`data-swiping`, `--toast-swipe-movement-x`) rather than Radix's `data-[swipe]` + `--radix-toast-swipe-*`.

## Verify by hand

1. `pnpm dev`, log into `/admin`, edit a category/user and save — a toast appears (bottom-right desktop / top mobile).
2. Success path shows the custom **green `success`** variant; a failed save shows the **red `destructive`** variant.
3. Toast auto-dismisses after ~5s; hovering pauses the timer.
4. Click the X (`ToastClose`) — closes immediately.
5. Swipe the toast — it follows the pointer and dismisses past the threshold.
6. Fire several saves quickly — stacking respects the Provider `limit`; no overlap glitches.
