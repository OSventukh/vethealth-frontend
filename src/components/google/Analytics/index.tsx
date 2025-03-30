import { headers } from 'next/headers';
import { GoogleAnalytics } from '@next/third-parties/google';
export default async function Analytics() {
  const { GOOGLE_ANALYTICS_ID } = process.env;
  const nonce = (await headers()).get('x-nonce');
  if (!GOOGLE_ANALYTICS_ID) return null;

  return <GoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} nonce={nonce || ''} />;
}
