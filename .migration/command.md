# command

2026-07-11, strategy: transformation engine (legacy `default` style). Verdict: migrated — cmdk untouched, only the stray Radix Dialog type import removed.

## Changed

- `src/components/ui/command.tsx`
  - Removed `import type { DialogProps } from "@radix-ui/react-dialog"` (command.tsx:3) — the only Radix reference in the file.
  - `CommandDialogProps` was `interface … extends DialogProps {}`; now
    `type CommandDialogProps = Omit<React.ComponentProps<typeof Dialog>, "children"> & { children?: React.ReactNode }`.
    `Dialog` is the already-migrated Base UI wrapper (`@/components/ui/dialog`). The `Omit<…, "children">` pins `children` back to plain `ReactNode` — Base `Dialog.Root` types `children` as a payload-render union, which is not assignable to cmdk's `Command` children.
  - Dropped the now-moot `// eslint-disable-next-line @typescript-eslint/no-empty-object-type` (the empty-interface pattern is gone; the project lints with oxlint, not ESLint, anyway).

Leftover scan (`grep -n "radix-ui\|@radix-ui" src/components/ui/command.tsx`): clean.

## Left alone

- **cmdk** (`Command`, `CommandInput`, `CommandList`, `CommandItem`, `CommandGroup`, `CommandEmpty`, `CommandSeparator`, `CommandShortcut`) — not a Radix library (hard rule). All `cmdk` primitives and their `[cmdk-*]` attribute selectors are untouched.
- `CommandDialog` still composes the migrated `Dialog`/`DialogContent` wrappers — nothing to change there beyond the type.

## Behavior changes

None. cmdk drives all interaction; only a compile-time type was rewired.

## Verify by hand

1. Open the multi-select combobox (`Combobox`, e.g. an admin form using it) — the popover opens with the command list.
2. Type in the search field — items filter (cmdk).
3. Arrow-key up/down + Enter selects; selected rows toggle their check.
4. `CommandEmpty` ("No result found.") shows when the query matches nothing.
