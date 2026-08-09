import { Suspense } from "react";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/utils/constants/generals";
import Optimizer from "@/components/external-scripts/optimizer";
import AdSense from "@/components/google/AdSense";
import Analytics from "@/components/google/Analytics";
import { Preconnect } from "@/components/preconnect";
import { inter } from "@/lib/fonts";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: SITE_TITLE,
	description: SITE_DESCRIPTION,
	metadataBase: new URL(process.env.CLIENT_URL!),
	openGraph: { images: "/social/social.jpg" },
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="uk">
			<body className={inter.className} suppressHydrationWarning>
				{/* Topic SVGs bypass /_next/image and load straight from the
				    image host — warm up its connection so the LCP image
				    doesn't pay DNS+TLS on top of its own load time. */}
				{process.env.NEXT_PUBLIC_IMAGE_SERVER && (
					<Preconnect href={process.env.NEXT_PUBLIC_IMAGE_SERVER} />
				)}
				{children}
				<Optimizer />
				{/* Analytics/AdSense read the per-request CSP nonce from headers(),
				    which can never be part of a prerendered shell. */}
				<Suspense fallback={null}>
					<Analytics />
					<AdSense />
				</Suspense>
			</body>
		</html>
	);
}
