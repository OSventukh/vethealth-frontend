import { useEffect, useState } from 'react';
import { CheckIcon, ChevronDown, X } from 'lucide-react';

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Badge } from '@/components/ui/badge';

import { cn } from '@/lib/utils';
import { Button } from './button';

type Props<T> = {
  options: ComboboxData<T>[];
  selectPlaceholder?: string;
  value?: ComboboxData<T>[];
  className?: string;
  onChange?: (value: { id: string }[]) => void;
  valueKey?: keyof T;
  labelKey?: keyof T;
};

type ComboboxData<T> = {
  id: string;
} & Partial<T>;

const getLabelAndValue = <T,>(
  items: ComboboxData<T>[] | undefined,
  {
    valueKey = 'id',
    labelKey,
  }: { valueKey?: keyof ComboboxData<T>; labelKey?: keyof ComboboxData<T> }
): {
  value: string;
  label: string;
}[] => {
  if (!items) return [];
  if (!valueKey || !labelKey)
    return items.map((item) => ({ value: item.id, label: '' }));
  return items.map((item) => ({
    value: String(item[valueKey]),
    label: String(item[labelKey]),
  }));
};

const getValue = <T,>(
  items: ComboboxData<T>[] | undefined,
  { valueKey = 'id' }: { valueKey?: keyof ComboboxData<T> }
): string[] => {
  if (!items) return [];
  if (!valueKey) return [];
  if (valueKey === 'id') return items.map((item) => item.id);
  return items.map((item) => String(item[valueKey]));
};

export const Combobox = <T,>({
  options,
  value,
  onChange,
  className,
  selectPlaceholder = 'Вибрати...',
  valueKey,
  labelKey,
}: Props<T>) => {
  const transformedOptions = getLabelAndValue<T>(options, {
    valueKey,
    labelKey,
  });
  const transformedValue = getValue<T>(value, { valueKey });
  const [selectedValues, setSelectedValues] = useState(
    () => new Set<string>(transformedValue)
  );

  useEffect(() => {
    const filterValues = Array.from(selectedValues).map((item) => {
      return { id: item };
    });
    onChange && onChange(filterValues);
  }, [selectedValues, onChange]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-0 py-0 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
            className
          )}
        >
          <div className="relative mr-auto flex grow flex-wrap items-center overflow-hidden px-3 py-1">
            {selectedValues?.size > 0 ? (
              transformedOptions &&
              transformedOptions
                .filter((option) => selectedValues.has(option.value))
                .map((option) => (
                  <Badge
                    key={option.value}
                    variant="outline"
                    className="m-[2px] gap-1 pr-0.5"
                  >
                    <span className="">{option.label}</span>
                    <span
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedValues((prev) => {
                          const next = new Set(prev);
                          next.delete(option.value);
                          return next;
                        });
                      }}
                      className="flex items-center rounded-sm px-[1px] hover:bg-accent hover:text-red-500"
                    >
                      <X size={14} />
                    </span>
                  </Badge>
                ))
            ) : (
              <span className="mr-auto text-sm">{selectPlaceholder}</span>
            )}
          </div>
          <div className="flex shrink-0 items-center self-stretch px-1 text-muted-foreground/60">
            {selectedValues?.size > 0 && (
              <div
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedValues(new Set());
                }}
                className="flex items-center self-stretch p-2 hover:text-red-500"
              >
                <X size={16} />
              </div>
            )}
            <span className="mx-0.5 my-2 w-[1px] self-stretch bg-border" />
            <div className="flex items-center self-stretch p-2 hover:text-muted-foreground">
              <ChevronDown size={16} />
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search numbers..." className="h-9" />
          <CommandList>
            <CommandEmpty>No result found.</CommandEmpty>

            {transformedOptions.map((option) => {
              const isSelected = selectedValues.has(option.value);

              return (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    if (isSelected) {
                      setSelectedValues((prev) => {
                        const next = new Set(prev);
                        next.delete(option.value);
                        return next;
                      });
                    } else {
                      setSelectedValues((prev) => {
                        const next = new Set(prev);
                        next.add(option.value);
                        return next;
                      });
                    }
                  }}
                >
                  <div
                    className={cn(
                      'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'opacity-50 [&_svg]:invisible'
                    )}
                  >
                    <CheckIcon className={cn('h-4 w-4')} />
                  </div>
                  <span>{option.label}</span>
                </CommandItem>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
