import Link from "next/link";
import type { ReactNode } from "react";
import { isSafeExternalUrl } from "@/lib/safe-url";

interface Props {
	href: string;
	className?: string;
	children: ReactNode;
}

export function BlockLink({ href, className, children }: Props) {
	if (href.startsWith("/")) {
		return (
			<Link href={href} className={className}>
				{children}
			</Link>
		);
	}
	if (!href || !isSafeExternalUrl(href)) {
		return <span className={className}>{children}</span>;
	}
	return (
		<a href={href} rel="noopener noreferrer" className={className}>
			{children}
		</a>
	);
}
