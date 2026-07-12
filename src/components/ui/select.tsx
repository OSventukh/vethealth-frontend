"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
	<SelectPrimitive.Trigger
		ref={ref}
		className={cn(
			"border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
			className,
		)}
		{...props}
	>
		{children}
		<SelectPrimitive.Icon
			render={<ChevronDown className="h-4 w-4 opacity-50" />}
		/>
	</SelectPrimitive.Trigger>
));
SelectTrigger.displayName = "SelectTrigger";

const SelectScrollUpButton = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.ScrollUpArrow>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpArrow>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.ScrollUpArrow
		ref={ref}
		className={cn(
			"top-0 flex w-full cursor-default items-center justify-center py-1",
			className,
		)}
		{...props}
	>
		<ChevronUp className="h-4 w-4" />
	</SelectPrimitive.ScrollUpArrow>
));
SelectScrollUpButton.displayName = "SelectScrollUpButton";

const SelectScrollDownButton = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.ScrollDownArrow>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownArrow>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.ScrollDownArrow
		ref={ref}
		className={cn(
			"bottom-0 flex w-full cursor-default items-center justify-center py-1",
			className,
		)}
		{...props}
	>
		<ChevronDown className="h-4 w-4" />
	</SelectPrimitive.ScrollDownArrow>
));
SelectScrollDownButton.displayName = "SelectScrollDownButton";

const SelectContent = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Popup>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Popup> &
		Pick<
			SelectPrimitive.Positioner.Props,
			"side" | "sideOffset" | "align" | "alignOffset" | "alignItemWithTrigger"
		> & { position?: "item-aligned" | "popper" }
>(
	(
		{
			className,
			children,
			position = "popper",
			side,
			sideOffset,
			align = "start",
			alignOffset,
			alignItemWithTrigger,
			...props
		},
		ref,
	) => (
		<SelectPrimitive.Portal>
			{/* z-50 — інакше попап селекта опиняється ПІД діалогом (Dialog має
			    z-50, а позиціонер без z-index програє йому в stacking order) */}
			<SelectPrimitive.Positioner
				side={side}
				sideOffset={sideOffset}
				align={align}
				alignOffset={alignOffset}
				alignItemWithTrigger={
					alignItemWithTrigger ?? position === "item-aligned"
				}
				className="isolate z-50"
			>
				<SelectPrimitive.Popup
					ref={ref}
					className={cn(
						"bg-popover text-popover-foreground data-starting-style:opacity-0 data-ending-style:opacity-0 data-starting-style:scale-95 data-ending-style:scale-95 relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border shadow-md transition-[transform,scale,opacity]",
						position === "popper" &&
							"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
						className,
					)}
					{...props}
				>
					<SelectScrollUpButton />
					<SelectPrimitive.List
						className={cn(
							"p-1",
							position === "popper" && "w-full min-w-[var(--anchor-width)]",
						)}
					>
						{children}
					</SelectPrimitive.List>
					<SelectScrollDownButton />
				</SelectPrimitive.Popup>
			</SelectPrimitive.Positioner>
		</SelectPrimitive.Portal>
	),
);
SelectContent.displayName = "SelectContent";

const SelectLabel = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.GroupLabel>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.GroupLabel>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.GroupLabel
		ref={ref}
		className={cn("py-1.5 pr-2 pl-8 text-sm font-semibold", className)}
		{...props}
	/>
));
SelectLabel.displayName = "SelectLabel";

const SelectItem = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
	<SelectPrimitive.Item
		ref={ref}
		className={cn(
			"data-highlighted:bg-accent data-highlighted:text-accent-foreground relative flex w-full cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50",
			className,
		)}
		{...props}
	>
		<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
			<SelectPrimitive.ItemIndicator>
				<Check className="h-4 w-4" />
			</SelectPrimitive.ItemIndicator>
		</span>

		<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
	</SelectPrimitive.Item>
));
SelectItem.displayName = "SelectItem";

const SelectSeparator = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.Separator
		ref={ref}
		className={cn("bg-muted -mx-1 my-1 h-px", className)}
		{...props}
	/>
));
SelectSeparator.displayName = "SelectSeparator";

export {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectScrollDownButton,
	SelectScrollUpButton,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
};
