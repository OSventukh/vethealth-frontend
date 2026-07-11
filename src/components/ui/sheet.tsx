"use client";

import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Sheet = SheetPrimitive.Root;

const SheetTrigger = React.forwardRef<
	HTMLButtonElement,
	SheetPrimitive.Trigger.Props & { asChild?: boolean }
>(({ asChild, children, ...props }, ref) =>
	asChild && React.isValidElement(children) ? (
		<SheetPrimitive.Trigger
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
		<SheetPrimitive.Trigger ref={ref} {...props}>
			{children}
		</SheetPrimitive.Trigger>
	),
);
SheetTrigger.displayName = "SheetTrigger";

const SheetClose = React.forwardRef<
	HTMLButtonElement,
	SheetPrimitive.Close.Props & { asChild?: boolean }
>(({ asChild, children, ...props }, ref) =>
	asChild && React.isValidElement(children) ? (
		<SheetPrimitive.Close
			ref={ref}
			render={children as React.ReactElement}
			nativeButton={false}
			{...props}
		/>
	) : (
		<SheetPrimitive.Close ref={ref} {...props}>
			{children}
		</SheetPrimitive.Close>
	),
);
SheetClose.displayName = "SheetClose";

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
	HTMLDivElement,
	SheetPrimitive.Backdrop.Props
>(({ className, ...props }, ref) => (
	<SheetPrimitive.Backdrop
		className={cn(
			"bg-background/80 data-starting-style:opacity-0 data-ending-style:opacity-0 fixed inset-0 z-50 backdrop-blur-xs transition-opacity",
			className,
		)}
		{...props}
		ref={ref}
	/>
));
SheetOverlay.displayName = "SheetOverlay";

const sheetVariants = cva(
	"fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out duration-500 data-ending-style:duration-300",
	{
		variants: {
			side: {
				top: "inset-x-0 top-0 border-b data-starting-style:-translate-y-full data-ending-style:-translate-y-full",
				bottom:
					"inset-x-0 bottom-0 border-t data-starting-style:translate-y-full data-ending-style:translate-y-full",
				left: "inset-y-0 left-0 h-full w-3/4 border-r data-starting-style:-translate-x-full data-ending-style:-translate-x-full sm:max-w-sm",
				right:
					"inset-y-0 right-0 h-full w-3/4 border-l data-starting-style:translate-x-full data-ending-style:translate-x-full sm:max-w-sm",
			},
		},
		defaultVariants: {
			side: "right",
		},
	},
);

interface SheetContentProps
	extends SheetPrimitive.Popup.Props, VariantProps<typeof sheetVariants> {
	showOverlay?: boolean;
}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
	(
		{ side = "right", showOverlay = true, className, children, ...props },
		ref,
	) => (
		<SheetPortal>
			{showOverlay && <SheetOverlay />}
			<SheetPrimitive.Popup
				ref={ref}
				className={cn(sheetVariants({ side }), className)}
				{...props}
			>
				{children}
				<SheetPrimitive.Close className="ring-offset-background focus:ring-ring data-open:bg-secondary absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
					<X className="h-4 w-4" />
					<span className="sr-only">Close</span>
				</SheetPrimitive.Close>
			</SheetPrimitive.Popup>
		</SheetPortal>
	),
);
SheetContent.displayName = "SheetContent";

const SheetHeader = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			"flex flex-col space-y-2 text-center sm:text-left",
			className,
		)}
		{...props}
	/>
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			"flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
			className,
		)}
		{...props}
	/>
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
	HTMLHeadingElement,
	SheetPrimitive.Title.Props
>(({ className, ...props }, ref) => (
	<SheetPrimitive.Title
		ref={ref}
		className={cn("text-foreground text-lg font-semibold", className)}
		{...props}
	/>
));
SheetTitle.displayName = "SheetTitle";

const SheetDescription = React.forwardRef<
	HTMLParagraphElement,
	SheetPrimitive.Description.Props
>(({ className, ...props }, ref) => (
	<SheetPrimitive.Description
		ref={ref}
		className={cn("text-muted-foreground text-sm", className)}
		{...props}
	/>
));
SheetDescription.displayName = "SheetDescription";

export {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetOverlay,
	SheetPortal,
	SheetTitle,
	SheetTrigger,
};
