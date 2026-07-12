"use client";

import * as React from "react";

import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxValue,
	useComboboxAnchor,
} from "@/components/ui/combobox";

type Entity = { id: string };

type Props<T extends Entity> = {
	options: T[];
	/** Обрані значення як `{ id }[]` — формат, у якому поля зберігаються в
	 * react-hook-form і йдуть у backend-пейлоад. */
	value?: Entity[];
	onChange?: (value: { id: string }[]) => void;
	labelKey: keyof T;
	placeholder?: string;
	className?: string;
};

/**
 * Мультивибір сутностей (теми/категорії) з чіпами й автодоповненням,
 * складений з shadcn Base UI Combobox-частин. Контрольований: джерело
 * правди — `value` (react-hook-form), onChange викликається лише при
 * взаємодії користувача.
 */
export function MultiCombobox<T extends Entity>({
	options,
	value,
	onChange,
	labelKey,
	placeholder = "Вибрати…",
	className,
}: Props<T>) {
	const anchor = useComboboxAnchor();
	const label = React.useCallback(
		(item: T) => String(item[labelKey] ?? item.id),
		[labelKey],
	);

	// value з форми може бути голими { id } — підтягуємо повні об'єкти з
	// options, щоб чіпи мали підписи.
	const selected = React.useMemo(
		() =>
			(value || [])
				.map((entry) => options.find((option) => option.id === entry.id))
				.filter((option): option is T => Boolean(option)),
		[value, options],
	);

	return (
		<Combobox
			multiple
			autoHighlight
			items={options}
			value={selected}
			onValueChange={(next) =>
				onChange?.(next.map((item) => ({ id: item.id })))
			}
			itemToStringLabel={label}
			isItemEqualToValue={(item, selectedItem) => item.id === selectedItem.id}
		>
			<ComboboxChips ref={anchor} className={className}>
				<ComboboxValue>
					{(values: T[]) => (
						<>
							{values.map((item) => (
								<ComboboxChip key={item.id}>{label(item)}</ComboboxChip>
							))}
							<ComboboxChipsInput
								placeholder={values.length ? undefined : placeholder}
							/>
						</>
					)}
				</ComboboxValue>
			</ComboboxChips>
			<ComboboxContent anchor={anchor}>
				<ComboboxEmpty>Нічого не знайдено.</ComboboxEmpty>
				<ComboboxList>
					{(item: T) => (
						<ComboboxItem key={item.id} value={item}>
							{label(item)}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	);
}
