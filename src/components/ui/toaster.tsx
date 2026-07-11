"use client";

import { Toast } from "@base-ui/react/toast";
import {
	Toast as ToastRoot,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
} from "@/components/ui/toast";
import { type ToastData, toastManager } from "@/components/ui/use-toast";

function ToastList() {
	const { toasts } = Toast.useToastManager<ToastData>();

	return toasts.map((toast) => {
		const { variant, action } = toast.data ?? {};

		return (
			<ToastRoot key={toast.id} toast={toast} variant={variant}>
				<div className="grid gap-1">
					{toast.title && <ToastTitle>{toast.title}</ToastTitle>}
					{toast.description && (
						<ToastDescription>{toast.description}</ToastDescription>
					)}
				</div>
				{action}
				<ToastClose />
			</ToastRoot>
		);
	});
}

export function Toaster() {
	return (
		<ToastProvider toastManager={toastManager}>
			<ToastViewport>
				<ToastList />
			</ToastViewport>
		</ToastProvider>
	);
}
