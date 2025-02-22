import clsx from 'clsx';
import Select, { GroupBase, Props } from 'react-select';

export default function Multiselect<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(props: Props<Option, IsMulti, Group>) {
  return (
    <Select
      classNames={{
        control: ({
          isFocused,
          isDisabled,
        }: {
          isFocused: boolean;
          isDisabled: boolean;
        }) =>
          clsx(
            'flex h-10 w-full h-min items-center justify-between rounded-md border border-input bg-background px-8 py-2 text-sm ring-offset-background placeholder:text-muted-foreground [&>span]:line-clamp-1',
            {
              'outline-hidden ring-2 ring-ring ring-offset-2': isFocused,
            },
            {
              'cursor-not-allowed opacity-50': isDisabled,
            }
          ),
        menuList: () =>
          'relative z-50 max-h-96 p-1 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        multiValue: () => 'bg-accent m-1 p-1 rounded-lg',
        multiValueRemove: () => 'hover:opacity-70',
        indicatorsContainer: () => 'h-4 w-4 opacity-50',
        option: () =>
          'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 hover:bg-accent hover:text-accent-foreground',
      }}
      placeholder="Вибрати..."
      name="colors"
      className="basic-multi-select"
      classNamePrefix="select"
      unstyled
      {...props}
    />
  );
}
