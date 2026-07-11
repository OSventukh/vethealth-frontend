"use client";

import * as React from "react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";

import { cn } from "@/lib/utils";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = React.forwardRef<
	HTMLButtonElement,
	PopoverPrimitive.Trigger.Props & { asChild?: boolean }
>(({ asChild, children, ...props }, ref) =>
	asChild && React.isValidElement(children) ? (
		<PopoverPrimitive.Trigger
			ref={ref}
			render={children as React.ReactElement}
			nativeButton={
				typeof children.type === "string" && children.type !== "button"
					? false
					: undefined
			}
			{...props}
		/>
	) : (
		<PopoverPrimitive.Trigger ref={ref} {...props}>
			{children}
		</PopoverPrimitive.Trigger>
	),
);
PopoverTrigger.displayName = "PopoverTrigger";

const PopoverContent = React.forwardRef<
	HTMLDivElement,
	PopoverPrimitive.Popup.Props &
		Pick<
			PopoverPrimitive.Positioner.Props,
			"align" | "alignOffset" | "side" | "sideOffset"
		>
>(
	(
		{
			className,
			align = "center",
			alignOffset,
			side,
			sideOffset = 4,
			...props
		},
		ref,
	) => (
		<PopoverPrimitive.Portal>
			<PopoverPrimitive.Positioner
				align={align}
				alignOffset={alignOffset}
				side={side}
				sideOffset={sideOffset}
				className="isolate z-50"
			>
				<PopoverPrimitive.Popup
					ref={ref}
					className={cn(
						"z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none transition-[translate,scale,opacity] data-starting-style:opacity-0 data-ending-style:opacity-0 data-starting-style:scale-95 data-ending-style:scale-95 data-[side=bottom]:data-starting-style:-translate-y-2 data-[side=left]:data-starting-style:translate-x-2 data-[side=right]:data-starting-style:-translate-x-2 data-[side=top]:data-starting-style:translate-y-2 origin-[--transform-origin]",
						className,
					)}
					{...props}
				/>
			</PopoverPrimitive.Positioner>
		</PopoverPrimitive.Portal>
	),
);
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent };
