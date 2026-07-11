"use client";

import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const NavigationMenu = ({
	className,
	children,
	...props
}: NavigationMenuPrimitive.Root.Props) => (
	<NavigationMenuPrimitive.Root
		className={cn(
			"relative z-10 flex max-w-max flex-1 items-center justify-center",
			className,
		)}
		{...props}
	>
		{children}
		<NavigationMenuViewport />
	</NavigationMenuPrimitive.Root>
);
NavigationMenu.displayName = "NavigationMenu";

const NavigationMenuList = React.forwardRef<
	HTMLUListElement,
	NavigationMenuPrimitive.List.Props
>(({ className, ...props }, ref) => (
	<NavigationMenuPrimitive.List
		ref={ref}
		className={cn(
			"group flex flex-1 list-none items-center justify-center space-x-1",
			className,
		)}
		{...props}
	/>
));
NavigationMenuList.displayName = "NavigationMenuList";

const NavigationMenuItem = NavigationMenuPrimitive.Item;

const navigationMenuTriggerStyle = cva(
	"group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 data-active:bg-accent/50 data-popup-open:bg-accent/50",
);

type NavigationMenuTriggerProps = NavigationMenuPrimitive.Trigger.Props & {
	showArrow?: boolean;
};

const NavigationMenuTrigger = React.forwardRef<
	HTMLButtonElement,
	NavigationMenuTriggerProps
>(({ className, children, showArrow, ...props }, ref) => (
	<NavigationMenuPrimitive.Trigger
		ref={ref}
		className={cn(navigationMenuTriggerStyle(), "group", className)}
		{...props}
	>
		{children}{" "}
		{showArrow && (
			<ChevronDown
				className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-popup-open:rotate-180"
				aria-hidden="true"
			/>
		)}
	</NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = "NavigationMenuTrigger";

const NavigationMenuContent = React.forwardRef<
	HTMLDivElement,
	NavigationMenuPrimitive.Content.Props
>(({ className, ...props }, ref) => (
	<NavigationMenuPrimitive.Content
		ref={ref}
		className={cn(
			"data-[activation-direction=left]:slide-in-from-right-52 data-[activation-direction=right]:slide-in-from-left-52 top-0 left-0 w-full md:absolute md:w-auto",
			className,
		)}
		{...props}
	/>
));
NavigationMenuContent.displayName = "NavigationMenuContent";

const NavigationMenuLink = NavigationMenuPrimitive.Link;

const NavigationMenuViewport = React.forwardRef<
	HTMLDivElement,
	NavigationMenuPrimitive.Viewport.Props
>(({ className, ...props }, ref) => (
	<NavigationMenuPrimitive.Portal>
		<NavigationMenuPrimitive.Positioner sideOffset={6} className="isolate z-50">
			<NavigationMenuPrimitive.Popup className="origin-[--transform-origin] bg-popover text-popover-foreground data-starting-style:opacity-0 data-ending-style:opacity-0 data-starting-style:scale-95 data-ending-style:scale-95 relative mt-1.5 h-[var(--popup-height)] w-full overflow-hidden rounded-md border shadow-lg transition-[opacity,transform] duration-200 md:w-[var(--popup-width)]">
				<NavigationMenuPrimitive.Viewport
					ref={ref}
					className={cn("relative h-full w-full", className)}
					{...props}
				/>
			</NavigationMenuPrimitive.Popup>
		</NavigationMenuPrimitive.Positioner>
	</NavigationMenuPrimitive.Portal>
));
NavigationMenuViewport.displayName = "NavigationMenuViewport";

// FLAG (behavior delta): Radix's Indicator was a pointer that tracked the
// active trigger beneath the List. Base UI has no equivalent part — its Icon is
// a chevron rendered inside the Trigger. This wrapper is kept only for export
// compatibility (the project has no NavigationMenu consumers) and no longer
// tracks the active trigger along the list.
const NavigationMenuIndicator = React.forwardRef<
	HTMLSpanElement,
	NavigationMenuPrimitive.Icon.Props
>(({ className, ...props }, ref) => (
	<NavigationMenuPrimitive.Icon
		ref={ref}
		className={cn(
			"top-full z-1 flex h-1.5 items-end justify-center overflow-hidden",
			className,
		)}
		{...props}
	>
		<div className="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md" />
	</NavigationMenuPrimitive.Icon>
));
NavigationMenuIndicator.displayName = "NavigationMenuIndicator";

export {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuIndicator,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	NavigationMenuViewport,
	navigationMenuTriggerStyle,
};
