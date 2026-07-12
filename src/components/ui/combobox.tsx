"use client";

import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { Check, ChevronDown, X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Combobox = ComboboxPrimitive.Root;

const ComboboxValue = ComboboxPrimitive.Value;

const ComboboxCollection = ComboboxPrimitive.Collection;

function ComboboxTrigger({
	className,
	children,
	...props
}: ComboboxPrimitive.Trigger.Props) {
	return (
		<ComboboxPrimitive.Trigger
			className={cn(
				"text-muted-foreground hover:text-foreground flex size-8 items-center justify-center rounded-md disabled:pointer-events-none disabled:opacity-50",
				className,
			)}
			{...props}
		>
			{children}
			<ChevronDown className="pointer-events-none size-4" />
		</ComboboxPrimitive.Trigger>
	);
}

function ComboboxClear({ className, ...props }: ComboboxPrimitive.Clear.Props) {
	return (
		<ComboboxPrimitive.Clear
			className={cn(
				"text-muted-foreground hover:text-foreground flex size-8 items-center justify-center rounded-md disabled:pointer-events-none disabled:opacity-50",
				className,
			)}
			{...props}
		>
			<X className="pointer-events-none size-4" />
		</ComboboxPrimitive.Clear>
	);
}

function ComboboxInput({
	className,
	disabled = false,
	showTrigger = true,
	showClear = false,
	...props
}: ComboboxPrimitive.Input.Props & {
	showTrigger?: boolean;
	showClear?: boolean;
}) {
	return (
		<div className="relative w-full">
			<ComboboxPrimitive.Input
				disabled={disabled}
				className={cn(
					"border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 pr-16 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				{...props}
			/>
			<div className="absolute inset-y-0 right-1 flex items-center">
				{showClear && <ComboboxClear disabled={disabled} />}
				{showTrigger && <ComboboxTrigger disabled={disabled} />}
			</div>
		</div>
	);
}

function ComboboxContent({
	className,
	side = "bottom",
	sideOffset = 6,
	align = "start",
	alignOffset = 0,
	anchor,
	...props
}: ComboboxPrimitive.Popup.Props &
	Pick<
		ComboboxPrimitive.Positioner.Props,
		"side" | "align" | "sideOffset" | "alignOffset" | "anchor"
	>) {
	return (
		<ComboboxPrimitive.Portal>
			<ComboboxPrimitive.Positioner
				side={side}
				sideOffset={sideOffset}
				align={align}
				alignOffset={alignOffset}
				anchor={anchor}
				className="isolate z-50"
			>
				<ComboboxPrimitive.Popup
					className={cn(
						"bg-popover text-popover-foreground data-starting-style:opacity-0 data-ending-style:opacity-0 data-starting-style:scale-95 data-ending-style:scale-95 relative max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) min-w-32 origin-(--transform-origin) overflow-hidden rounded-md border shadow-md transition-[transform,scale,opacity]",
						className,
					)}
					{...props}
				/>
			</ComboboxPrimitive.Positioner>
		</ComboboxPrimitive.Portal>
	);
}

function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
	return (
		<ComboboxPrimitive.List
			className={cn(
				"max-h-80 overflow-y-auto overscroll-contain p-1",
				className,
			)}
			{...props}
		/>
	);
}

function ComboboxItem({
	className,
	children,
	...props
}: ComboboxPrimitive.Item.Props) {
	return (
		<ComboboxPrimitive.Item
			className={cn(
				"data-highlighted:bg-accent data-highlighted:text-accent-foreground relative flex w-full cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50",
				className,
			)}
			{...props}
		>
			<span className="absolute left-2 flex size-3.5 items-center justify-center">
				<ComboboxPrimitive.ItemIndicator>
					<Check className="size-4" />
				</ComboboxPrimitive.ItemIndicator>
			</span>
			{children}
		</ComboboxPrimitive.Item>
	);
}

function ComboboxGroup({ className, ...props }: ComboboxPrimitive.Group.Props) {
	return <ComboboxPrimitive.Group className={cn(className)} {...props} />;
}

function ComboboxLabel({
	className,
	...props
}: ComboboxPrimitive.GroupLabel.Props) {
	return (
		<ComboboxPrimitive.GroupLabel
			className={cn("py-1.5 pr-2 pl-8 text-sm font-semibold", className)}
			{...props}
		/>
	);
}

function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
	return (
		<ComboboxPrimitive.Empty
			className={cn(
				"text-muted-foreground px-2 py-4 text-center text-sm empty:hidden",
				className,
			)}
			{...props}
		/>
	);
}

function ComboboxSeparator({
	className,
	...props
}: ComboboxPrimitive.Separator.Props) {
	return (
		<ComboboxPrimitive.Separator
			className={cn("bg-muted -mx-1 my-1 h-px", className)}
			{...props}
		/>
	);
}

function ComboboxChips({ className, ...props }: ComboboxPrimitive.Chips.Props) {
	return (
		<ComboboxPrimitive.Chips
			className={cn(
				"border-input bg-background ring-offset-background focus-within:ring-ring flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border px-2 py-1.5 text-sm focus-within:ring-2 focus-within:ring-offset-2",
				className,
			)}
			{...props}
		/>
	);
}

function ComboboxChip({
	className,
	children,
	showRemove = true,
	...props
}: ComboboxPrimitive.Chip.Props & {
	showRemove?: boolean;
}) {
	return (
		<ComboboxPrimitive.Chip
			className={cn(
				"text-foreground inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
				className,
			)}
			{...props}
		>
			{children}
			{showRemove && (
				<ComboboxPrimitive.ChipRemove
					className="hover:text-destructive rounded-sm p-px opacity-70 hover:opacity-100"
					aria-label="Прибрати"
				>
					<X className="pointer-events-none size-3.5" />
				</ComboboxPrimitive.ChipRemove>
			)}
		</ComboboxPrimitive.Chip>
	);
}

function ComboboxChipsInput({
	className,
	...props
}: ComboboxPrimitive.Input.Props) {
	return (
		<ComboboxPrimitive.Input
			className={cn(
				"placeholder:text-muted-foreground min-w-16 flex-1 bg-transparent outline-none",
				className,
			)}
			{...props}
		/>
	);
}

function useComboboxAnchor() {
	return React.useRef<HTMLDivElement | null>(null);
}

export {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxClear,
	ComboboxCollection,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxGroup,
	ComboboxInput,
	ComboboxItem,
	ComboboxLabel,
	ComboboxList,
	ComboboxSeparator,
	ComboboxTrigger,
	ComboboxValue,
	useComboboxAnchor,
};
