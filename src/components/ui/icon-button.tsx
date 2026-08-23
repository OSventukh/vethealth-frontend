import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	icon?: React.ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
	({ icon, className, ...props }, ref) => {
		return (
			<Button
				ref={ref}
				className={cn(
					"flex h-10 w-10 items-center justify-center rounded-full bg-transparent p-2 text-gray-600 transition-colors duration-200 hover:bg-gray-100 active:bg-gray-200",
					className,
				)}
				{...props}
			>
				{icon}
			</Button>
		);
	},
);

IconButton.displayName = "IconButton";
