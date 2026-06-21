/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",
	images: {
		formats: ["image/avif", "image/webp"],
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

module.exports = nextConfig;
