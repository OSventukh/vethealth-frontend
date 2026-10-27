import { connection } from "next/server";
import Script from "next/script";

export default async function AdSense() {
	// Читаємо env у рантаймі (Coolify), а не запікаємо значення з білда.
	await connection();
	const { ADSENSE_PUBLISHER_ID } = process.env;

	if (!ADSENSE_PUBLISHER_ID || ADSENSE_PUBLISHER_ID.trim() === "") return null;

	return (
		<Script
			async
			src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${ADSENSE_PUBLISHER_ID}`}
			crossOrigin="anonymous"
			strategy="lazyOnload"
		/>
	);
}
