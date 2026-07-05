import { headers } from "next/headers";
import Script from "next/script";

// GA is loaded with strategy="lazyOnload" (after the load event) instead of
// @next/third-parties' <GoogleAnalytics>, which preloads gtag.js (~160 KB)
// during page startup and competes with the LCP image for bandwidth on mobile.
export default async function Analytics() {
	const { GOOGLE_ANALYTICS_ID } = process.env;
	const nonce = (await headers()).get("x-nonce");
	if (!GOOGLE_ANALYTICS_ID || GOOGLE_ANALYTICS_ID.trim() === "") return null;

	return (
		<>
			<Script
				src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
				strategy="lazyOnload"
				nonce={nonce || ""}
			/>
			<Script id="ga-init" strategy="lazyOnload" nonce={nonce || ""}>
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
