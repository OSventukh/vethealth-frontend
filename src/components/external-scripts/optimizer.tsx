import Script from "next/script";

// CRO/AB-testing script used only as a live testbed for a work project.
// Self-hosted copy of https://optimize.vethealth.com.ua/optimize.js (see
// public/js/optimize.js); the CRS backend it talks to is passed via
// data-crs-url (must stay in connect-src in src/proxy.ts).
// Enabled per environment (staging) via OPTIMIZER_ENABLED=true — keep it off
// in production: it's extra JS + potential CLS on every page.
const CRS_URL = "https://crsoptimizer.conversionrate.store";

export default function Optimizer() {
	if (process.env.OPTIMIZER_ENABLED !== "true") return null;

	return (
		<>
			<link rel="preconnect" href={CRS_URL} crossOrigin="anonymous" />
			<Script
				src="/js/optimize.js?code=Eja4hwk8eP"
				strategy="lazyOnload"
			/>
		</>
	);
}
