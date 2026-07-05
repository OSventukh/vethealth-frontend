const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",
	experimental: {
		// Inline the (small) global CSS into the HTML — removes a
		// render-blocking request on the mobile critical path.
		inlineCss: true,
	},
	images: {
		formats: ["image/avif", "image/webp"],
		// Post/content uploads get unique filenames, but topic images reuse the
		// slugified original name — a replaced topic image can stay stale for
		// up to this TTL, so keep it at days, not months.
		minimumCacheTTL: 604800,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "vethealth.com.ua",
			},
			{
				protocol: "https",
				hostname: "*.vethealth.com.ua",
			},
		],
	},
};

module.exports = withBundleAnalyzer(nextConfig);
