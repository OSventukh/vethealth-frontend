import { Toast } from "@base-ui/react/toast";
import type * as React from "react";

type ToastVariant = "default" | "success" | "destructive";

interface ToastData {
	variant?: ToastVariant;
	action?: React.ReactNode;
}

// Module-level manager: `toast()` can be called from anywhere (event handlers,
// server-action callbacks) without a Provider ancestor. The <Toaster/> wires
// this exact instance into a <Toast.Provider toastManager={toastManager}>.
const toastManager = Toast.createToastManager<ToastData>();

interface ToastInput {
	title?: React.ReactNode;
	description?: React.ReactNode;
	variant?: ToastVariant;
	action?: React.ReactNode;
	duration?: number;
}

function toast({ title, description, variant, action, duration }: ToastInput) {
	const id = toastManager.add({
		title,
		description,
		timeout: duration,
		data: { variant, action },
	});

	return {
		id,
		dismiss: () => toastManager.close(id),
		update: (props: ToastInput) =>
			toastManager.update(id, {
				title: props.title,
				description: props.description,
				data: { variant: props.variant, action: props.action },
			}),
	};
}

function useToast() {
	return {
		toast,
		dismiss: (toastId?: string) => toastManager.close(toastId),
	};
}

export { toast, toastManager, useToast };
export type { ToastData, ToastInput };
