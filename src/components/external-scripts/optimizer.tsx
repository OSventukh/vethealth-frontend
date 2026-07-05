import Script from "next/script";

// CRO/AB-testing script (local copy of the optimizer served from
// optimize.vethealth.com.ua) used only as a live testbed for a work project.
// Enabled per environment (staging) via OPTIMIZER_ENABLED=true — keep it off
// in production: it's extra JS + potential CLS on every page.
export default function Optimizer() {
	if (process.env.OPTIMIZER_ENABLED !== "true") return null;

	return (
		<>
			<Script
				type="text/javascript"
				src="https://optimize.vethealth.com.ua/comp/5WjEAtrEuS.js"
				strategy="lazyOnload"
			/>
		</>
	);
}
