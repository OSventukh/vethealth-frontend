import Script from "next/script";

// Mida.so A/B-testing script — a second testbed next to the CRS optimizer.
// It loads its experiment code from cdn.mida.so and talks to *.mida.so APIs,
// so https://*.mida.so must stay in script-src/connect-src/img-src in
// src/proxy.ts.
// Enabled per environment (staging) via MIDA_ENABLED=true — keep it off in
// production: it's extra JS + potential CLS on every page.
const MIDA_ORIGIN = "https://cdn.mida.so";
const MIDA_SRC = `${MIDA_ORIGIN}/js/optimize.js?key=LZo291PlY3vWKdqgvV5wO6`;

export default function Mida() {
	if (process.env.MIDA_ENABLED !== "true") return null;

	return (
		<>
			<link rel="preconnect" href={MIDA_ORIGIN} />
			<Script src={MIDA_SRC} strategy="afterInteractive" />
		</>
	);
}
