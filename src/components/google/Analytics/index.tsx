import { GoogleAnalytics } from '@next/third-parties/google';

export default function Analytics() {
  const { GOOGLE_ANALYTICS_ID } = process.env;

  if (!GOOGLE_ANALYTICS_ID) return null;

  return <GoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} />;
}
