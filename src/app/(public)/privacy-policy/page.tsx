import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { api } from "@/api";
import { PageContent } from "@/components/page-blocks/page-content";
import CustomBreadcrumb from "@/components/ui/custom/custom-breadcrumb";
import { raleway } from "@/lib/fonts";
import { NOT_FOUND_TITLE } from "@/utils/constants/generals";
import { buildContentMetadata } from "../_lib/seo";
import Footer from "../components/Footer";
import Header from "../components/Header";

const getPrivacyPolicyPage = cache(() =>
	api.pages.getOne({
		slug: "privacy-policy",
		query: { include: "metadata" },
		tags: ["pages"],
	}),
);

export async function generateMetadata(): Promise<Metadata> {
	const page = await getPrivacyPolicyPage();

	if (!page) {
		return { title: NOT_FOUND_TITLE };
	}
	return buildContentMetadata({
		title: page.title,
		canonicalPath: "/privacy-policy",
		meta: page.metadata,
	});
}

export default async function PrivacyPolicyPage() {
	const privacyPolicyPage = await getPrivacyPolicyPage();

	if (!privacyPolicyPage) return notFound();

	return (
		<>
			<Header />
			<main>
				<div className="container">
					<CustomBreadcrumb
						prevPages={[{ href: "/", label: "Головна" }]}
						currentPage={{ label: "Політика конфіденційності" }}
					/>
					<div className="border-border mt-4 rounded-xl border-[1px] bg-white p-8">
						<h1
							className={`${raleway.className} my-4 text-center text-lg font-[600] uppercase`}
						>
							{privacyPolicyPage.title}
						</h1>
						<PageContent
							content={privacyPolicyPage?.content}
							proseClassName="prose prose-headings:text-sm max-w-none"
						/>
					</div>
				</div>
			</main>
			<Footer />
		</>
	);
}
