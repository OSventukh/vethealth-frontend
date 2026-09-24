import Script from "next/script";

// CRO/AB-testing script used only as a live testbed for a work project.
// Loaded from the CRS optimizer host; the bundle has its own CRS_URL baked in
// and posts stats to https://crsoptimizer.conversionrate.store — both origins
// must stay in script-src/connect-src in src/proxy.ts.
// public/js/optimize.js is the previous self-hosted loader, kept as a rollback.
// Enabled per environment (staging) via OPTIMIZER_ENABLED=true — keep it off
// in production: it's extra JS + potential CLS on every page.
const OPTIMIZER_ORIGIN = "https://optimizer.oskh.com.ua";
const OPTIMIZER_SRC = `${OPTIMIZER_ORIGIN}/comp/XoQrlB9WgF.js`;

export default function Optimizer() {
	if (process.env.OPTIMIZER_ENABLED !== "true") return null;

	return (
		<>
			<link rel="preconnect" href={OPTIMIZER_ORIGIN} />
			<Script src={OPTIMIZER_SRC} strategy="lazyOnload" />
		</>
	);
}
