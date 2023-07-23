import '@/styles/globals.css';
import { useMemo } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { CssBaseline } from '@mui/material';
import type { AppProps } from 'next/app';
import AdminPanelLayout from '@/components/admin/Layout';
import Layout from '@/components/Layout';
import Theme from '@/theme/themeProvider';
import { SessionProvider } from 'next-auth/react';
import { General } from '@/utils/constants/general.enum';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const router = useRouter();
  const isAdminPanel = useMemo(
    () => router.pathname.startsWith('/admin'),
    [router.pathname]
  );

  const isAuthPage = useMemo(
    () =>
      router.pathname.startsWith('/auth') ||
      router.pathname.startsWith('/confirm'),
    [router.pathname]
  );

  return (
    <>
      {process.env.NODE_ENV === 'production' && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');
        `}
          </Script>
        </>
      )}

      <Head>
        <title>{General.SiteTitle}</title>
        <meta name="title" content={General.SiteTitle} />
        <meta name="description" content={General.SiteDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png?v=1"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png?v=1"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png?v=1"
        />
        <link rel="manifest" href="/site.webmanifest?v=1" />
        <link
          rel="mask-icon"
          href="/safari-pinned-tab.svg?v=1"
          color="#5bbad5"
        />
        <link rel="shortcut icon" href="/favicon.ico?v=1" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/social.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:image" content="/social.png" />
      </Head>
      <SessionProvider session={session} refetchInterval={10 * 60}>
        <CssBaseline />
        {isAdminPanel ? (
          <Theme>
            <AdminPanelLayout>
              <Component {...pageProps} />
            </AdminPanelLayout>
          </Theme>
        ) : isAuthPage ? (
          <Theme>
            <Component {...pageProps} />
          </Theme>
        ) : (
          <Layout
            general={pageProps.general}
            navigationMenu={pageProps.navigationMenu}
          >
            <Component {...pageProps} />
          </Layout>
        )}
      </SessionProvider>
    </>
  );
}
