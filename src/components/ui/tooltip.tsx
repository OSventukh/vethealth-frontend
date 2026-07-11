"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import * as React from "react";

import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = React.forwardRef<
	HTMLButtonElement,
	TooltipPrimitive.Trigger.Props & { asChild?: boolean }
>(({ asChild, children, ...props }, ref) =>
	asChild && React.isValidElement(children) ? (
		<TooltipPrimitive.Trigger
			ref={ref}
			render={children as React.ReactElement}
			{...props}
		/>
	) : (
		<TooltipPrimitive.Trigger ref={ref} {...props}>
			{children}
		</TooltipPrimitive.Trigger>
	),
);
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = React.forwardRef<
	HTMLDivElement,
	TooltipPrimitive.Popup.Props &
		Pick<
			TooltipPrimitive.Positioner.Props,
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
		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Positioner
				align={align}
				alignOffset={alignOffset}
				side={side}
				sideOffset={sideOffset}
				className="isolate z-50"
			>
				<TooltipPrimitive.Popup
					ref={ref}
					className={cn(
						"bg-popover text-popover-foreground z-50 overflow-hidden rounded-md border px-3 py-1.5 text-sm shadow-md outline-none transition-[translate,scale,opacity] data-starting-style:opacity-0 data-ending-style:opacity-0 data-starting-style:scale-95 data-ending-style:scale-95 data-[side=bottom]:data-starting-style:-translate-y-2 data-[side=left]:data-starting-style:translate-x-2 data-[side=right]:data-starting-style:-translate-x-2 data-[side=top]:data-starting-style:translate-y-2 origin-[--transform-origin]",
						className,
					)}
					{...props}
				/>
			</TooltipPrimitive.Positioner>
		</TooltipPrimitive.Portal>
	),
);
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
