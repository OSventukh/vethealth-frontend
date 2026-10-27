import { connection } from "next/server";
import Script from "next/script";

// GA is loaded with strategy="lazyOnload" (after the load event) instead of
// @next/third-parties' <GoogleAnalytics>, which preloads gtag.js (~160 KB)
// during page startup and competes with the LCP image for bandwidth on mobile.
export default async function Analytics() {
	const { GOOGLE_ANALYTICS_ID } = process.env;
	// Читаємо env у рантаймі (Coolify), а не запікаємо значення з білда.
	await connection();
	if (!GOOGLE_ANALYTICS_ID || GOOGLE_ANALYTICS_ID.trim() === "") return null;

	return (
		<>
			<Script
				src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
				strategy="lazyOnload"
			/>
			<Script id="ga-init" strategy="lazyOnload">
				{`
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());
					gtag('config', '${GOOGLE_ANALYTICS_ID}');
				`}
			</Script>
		</>
	);
}
