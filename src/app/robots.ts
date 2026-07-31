import type { MetadataRoute } from "next";
import { SITE_HOST } from "@/utils/constants/generals";

export default function robots(): MetadataRoute.Robots {
	const isAllowed = process.env.NODE_ENV === "production";

	if (!isAllowed) {
		return {
			rules: {
				userAgent: "*",
				disallow: ["/", "/admin"],
			},
		};
	}

	const base = (process.env.CLIENT_URL || `https://${SITE_HOST}`).replace(
		/\/+$/,
		"",
	);

	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/admin"],
		},
		sitemap: `${base}/sitemap.xml`,
	};
}
