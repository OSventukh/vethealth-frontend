import type { Metadata } from "next";
import {
	SITE_DESCRIPTION,
	SITE_NAME,
	SITE_TITLE,
} from "@/utils/constants/generals";
import "./globals.css";
import Optimizer from "@/components/external-scripts/optimizer";
import AdSense from "@/components/google/AdSense";
import Analytics from "@/components/google/Analytics";
import { Preconnect } from "@/components/preconnect";
import { inter } from "@/lib/fonts";

export const metadata: Metadata = {
	title: SITE_TITLE,
	description: SITE_DESCRIPTION,
	metadataBase: new URL(process.env.CLIENT_URL!),
	openGraph: {
		type: "website",
		siteName: SITE_NAME,
		locale: "uk_UA",
		images: "/social/social.jpg",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="uk">
			<Optimizer />
			<Analytics />
			<AdSense />
			<body className={inter.className} suppressHydrationWarning>
				{/* Topic SVGs bypass /_next/image and load straight from the
				    image host — warm up its connection so the LCP image
				    doesn't pay DNS+TLS on top of its own load time. */}
				{process.env.NEXT_PUBLIC_IMAGE_SERVER && (
					<Preconnect href={process.env.NEXT_PUBLIC_IMAGE_SERVER} />
				)}
				{children}
			</body>
		</html>
	);
}
