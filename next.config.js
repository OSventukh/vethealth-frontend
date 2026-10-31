const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",
	 	cacheComponents: true,
		partialPrefetching: true,
	experimental: {
		// Inline the (small) global CSS into the HTML — removes a
		// render-blocking request on the mobile critical path.
		inlineCss: true,
		serverActions: {
			// Картинки вантажаться через server action (image-upload.action);
			// дефолтний ліміт 1 MB тихо ріже все більше за нього. Backend
			// приймає до 5 MB (FILE_MAX_SIZE) — тримаємо трохи вище, щоб
			// авторитетним лишався backend-ліміт.
			bodySizeLimit: "6mb",
		},
	},
	images: {
		formats: ["image/avif", "image/webp"],
		// All uploads get unique filenames now (topic images used to reuse the
		// slugified original name, so a replaced one could stay stale for this
		// TTL). Legacy topic files still have suffix-less names — keep days.
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
