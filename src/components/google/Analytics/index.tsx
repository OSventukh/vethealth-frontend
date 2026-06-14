import { GoogleAnalytics } from "@next/third-parties/google";
import { headers } from "next/headers";
export default async function Analytics() {
	const { GOOGLE_ANALYTICS_ID } = process.env;
	const nonce = (await headers()).get("x-nonce");
	if (!GOOGLE_ANALYTICS_ID || GOOGLE_ANALYTICS_ID.trim() === "") return null;

	return <GoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} nonce={nonce || ""} />;
}
