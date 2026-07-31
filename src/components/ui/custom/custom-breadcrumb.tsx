import Link from "next/link";
import React from "react";

import { absoluteUrl } from "@/app/(public)/_lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type Props = {
	prevPages: { href: string; label: string }[];
	currentPage: { label: string };
};

export default function CustomBreadcrumb({ prevPages, currentPage }: Props) {
	const breadcrumbJsonLd = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			...prevPages.map((item, index) => ({
				"@type": "ListItem",
				position: index + 1,
				name: item.label,
				item: absoluteUrl(item.href),
			})),
			{
				"@type": "ListItem",
				position: prevPages.length + 1,
				name: currentPage.label,
			},
		],
	};

	return (
		<div className="mt-4 flex lg:justify-center">
			<JsonLd data={breadcrumbJsonLd} />
			<Breadcrumb>
				<BreadcrumbList>
					{prevPages.map((item, index) => (
						<React.Fragment key={index}>
							<BreadcrumbItem>
								<Link href={item.href}>{item.label}</Link>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
						</React.Fragment>
					))}
					<BreadcrumbItem>
						<BreadcrumbPage>{currentPage.label}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		</div>
	);
}
