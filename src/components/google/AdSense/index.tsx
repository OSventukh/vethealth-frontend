import Script from 'next/script';
import { headers } from 'next/headers';

export default async function AdSense() {
  const nonce = (await headers()).get('x-nonce');
  const { ADSENSE_PUBLISHER_ID } = process.env;

  if (!ADSENSE_PUBLISHER_ID) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${ADSENSE_PUBLISHER_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
      nonce={nonce || ''}
    />
  );
}
