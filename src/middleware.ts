import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export { default } from 'next-auth/middleware';
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};

// Environment-specific origins grouped together for clarity
const DEV_ORIGINS = [
  'http://localhost:*'
];

const PROD_ORIGINS = [
  'https://vethealth.com.ua',
  'https://www.vethealth.com.ua',
  'https://*.vethealth.com.ua',
];

function getAllowedOrigins(request: NextRequest) {
  const host = request.headers.get('host');
  // Simple check: if host includes localhost, treat as dev
  if (host && (host.includes('localhost') || host.startsWith('127.'))) {
    return [...DEV_ORIGINS, ...PROD_ORIGINS].join(' ');
  }
  return PROD_ORIGINS.join(' ');
}

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const cspHeader = `
  default-src 'self';
  script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: ${getAllowedOrigins(request)} https://*.unsplash.com https://images.unsplash.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' ${getAllowedOrigins(request)} https://www.google-analytics.com https://*.googleapis.com;
  frame-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'self';
  block-all-mixed-content;
  upgrade-insecure-requests;
`;
  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim();

  // Define Permissions-Policy header
  const permissionsPolicy = `
  accelerometer=(),
  ambient-light-sensor=(),
  autoplay=(),
  battery=(),
  camera=(),
  cross-origin-isolated=(),
  display-capture=(),
  document-domain=(),
  encrypted-media=(),
  execution-while-not-rendered=(),
  execution-while-out-of-viewport=(),
  fullscreen=(self),
  geolocation=(),
  gyroscope=(),
  keyboard-map=(),
  magnetometer=(),
  microphone=(),
  midi=(),
  navigation-override=(),
  payment=(),
  picture-in-picture=(),
  publickey-credentials-get=(),
  screen-wake-lock=(),
  sync-xhr=(self),
  usb=(),
  web-share=(),
  xr-spatial-tracking=()
`
    .replace(/\s{2,}/g, ' ')
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  requestHeaders.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  );

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  );

  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Add the Permissions-Policy header
  response.headers.set('Permissions-Policy', permissionsPolicy);

  return response;
}
