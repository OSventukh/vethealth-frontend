"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = React.forwardRef<
	HTMLButtonElement,
	DialogPrimitive.Trigger.Props & { asChild?: boolean }
>(({ asChild, children, ...props }, ref) =>
	asChild && React.isValidElement(children) ? (
		<DialogPrimitive.Trigger
			ref={ref}
			render={children as React.ReactElement}
			nativeButton={false}
			{...props}
		/>
	) : (
		<DialogPrimitive.Trigger ref={ref} {...props}>
			{children}
		</DialogPrimitive.Trigger>
	),
);
DialogTrigger.displayName = "DialogTrigger";

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = React.forwardRef<
	HTMLButtonElement,
	DialogPrimitive.Close.Props & { asChild?: boolean }
>(({ asChild, children, ...props }, ref) =>
	asChild && React.isValidElement(children) ? (
		<DialogPrimitive.Close
			ref={ref}
			render={children as React.ReactElement}
			nativeButton={false}
			{...props}
		/>
	) : (
		<DialogPrimitive.Close ref={ref} {...props}>
			{children}
		</DialogPrimitive.Close>
	),
);
DialogClose.displayName = "DialogClose";

const DialogOverlay = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Backdrop>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Backdrop>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Backdrop
		ref={ref}
		className={cn(
			"data-starting-style:opacity-0 data-ending-style:opacity-0 fixed inset-0 z-50 bg-black/80 transition-opacity",
			className,
		)}
		{...props}
	/>
));
DialogOverlay.displayName = "DialogOverlay";

const DialogContent = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Popup>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Popup>
>(({ className, children, ...props }, ref) => (
	<DialogPortal>
		<DialogOverlay />
		<DialogPrimitive.Popup
			ref={ref}
			className={cn(
				"bg-background data-starting-style:opacity-0 data-starting-style:scale-95 data-ending-style:opacity-0 data-ending-style:scale-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg transition-all duration-200 sm:rounded-lg",
				className,
			)}
			{...props}
		>
			{children}
			<DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-open:bg-accent data-open:text-muted-foreground absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
				<X className="h-4 w-4" />
				<span className="sr-only">Close</span>
			</DialogPrimitive.Close>
		</DialogPrimitive.Popup>
	</DialogPortal>
));
DialogContent.displayName = "DialogContent";

const DialogHeader = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			"flex flex-col space-y-1.5 text-center sm:text-left",
			className,
		)}
		{...props}
	/>
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
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
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Title>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Title
		ref={ref}
		className={cn(
			"text-lg leading-none font-semibold tracking-tight",
			className,
		)}
		{...props}
	/>
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Description>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Description
		ref={ref}
		className={cn("text-muted-foreground text-sm", className)}
		{...props}
	/>
));
DialogDescription.displayName = "DialogDescription";

export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
};
