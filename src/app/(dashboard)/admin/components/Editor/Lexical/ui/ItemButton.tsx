import type React from "react";

type Props = {
	onClick?: React.MouseEventHandler;
	icon?: React.ReactElement;
	children: React.ReactNode;
};
export default function ItemButton({ onClick, icon, children }: Props) {
	return (
		<button
			onClick={onClick}
			onTouchStart={(e) => e.stopPropagation()}
			className="flex w-full items-center gap-2 text-sm [&_svg]:size-4 [&_svg]:shrink-0"
		>
			{icon && icon}
			{children}
		</button>
	);
}
