"use client";

import { Toast as ToastPrimitives } from "@base-ui/react/toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
	HTMLDivElement,
	ToastPrimitives.Viewport.Props
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Portal>
		<ToastPrimitives.Viewport
			ref={ref}
			className={cn(
				"fixed top-0 left-0 z-100 flex max-h-screen w-full flex-col-reverse p-4 sm:top-auto sm:bottom-0 sm:left-0 sm:flex-col md:max-w-[420px]",
				className,
			)}
			{...props}
		/>
	</ToastPrimitives.Portal>
));
ToastViewport.displayName = "ToastViewport";

const toastVariants = cva(
	"group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all duration-300 data-starting-style:-translate-y-full sm:data-starting-style:translate-y-full data-starting-style:opacity-0 data-ending-style:translate-x-full data-ending-style:opacity-0 data-[swiping]:translate-x-[var(--toast-swipe-movement-x)] data-[swiping]:transition-none",
	{
		variants: {
			variant: {
				default: "border bg-background text-foreground",
				success:
					"success group border-success bg-success text-success-foreground",
				destructive:
					"destructive group border-destructive bg-destructive text-destructive-foreground",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

const Toast = React.forwardRef<
	HTMLDivElement,
	ToastPrimitives.Root.Props & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => (
	<ToastPrimitives.Root
		ref={ref}
		className={cn(toastVariants({ variant }), className)}
		{...props}
	/>
));
Toast.displayName = "Toast";

const ToastAction = React.forwardRef<
	HTMLButtonElement,
	ToastPrimitives.Action.Props
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Action
		ref={ref}
		className={cn(
			"ring-offset-background hover:bg-secondary focus:ring-ring group-[.destructive]:border-muted/40 group-[.success]:border-muted/40 hover:group-[.destructive]:border-destructive/30 hover:group-[.success]:border-success/30 hover:group-[.destructive]:bg-destructive hover:group-[.success]:bg-success hover:group-[.destructive]:text-destructive-foreground hover:group-[.success]:text-success-foreground focus:group-[.destructive]:ring-destructive focus:group-[.success]:ring-success inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50",
			className,
		)}
		{...props}
	/>
));
ToastAction.displayName = "ToastAction";

const ToastClose = React.forwardRef<
	HTMLButtonElement,
	ToastPrimitives.Close.Props
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Close
		ref={ref}
		className={cn(
			"text-foreground/50 hover:text-foreground absolute top-2 right-2 rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-100 group-[.destructive]:text-red-300 hover:group-[.destructive]:text-red-50 focus:opacity-100 focus:ring-2 focus:outline-hidden focus:group-[.destructive]:ring-red-400 focus:group-[.destructive]:ring-offset-red-600",
			className,
		)}
		{...props}
	>
		<X className="h-4 w-4" />
	</ToastPrimitives.Close>
));
ToastClose.displayName = "ToastClose";

const ToastTitle = React.forwardRef<
	HTMLHeadingElement,
	ToastPrimitives.Title.Props
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Title
		ref={ref}
		className={cn("text-sm font-semibold", className)}
		{...props}
	/>
));
ToastTitle.displayName = "ToastTitle";

const ToastDescription = React.forwardRef<
	HTMLParagraphElement,
	ToastPrimitives.Description.Props
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Description
		ref={ref}
		className={cn("text-sm opacity-90", className)}
		{...props}
	/>
));
ToastDescription.displayName = "ToastDescription";

export {
	Toast,
	ToastAction,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
};
