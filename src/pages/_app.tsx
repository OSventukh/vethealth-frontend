import '@/styles/globals.css';
import { useMemo } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { CssBaseline } from '@mui/material';
import type { AppProps } from 'next/app';
import AdminPanelLayout from '@/layouts/admin';
import Layout from '@/layouts/public';
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
        <meta
          name="description"
          content="Корисні статті про різні аспекти ветеринарної практики та догляду за тваринами. На нашому сайті ви дізнаєтеся про найновіші методи лікування, профілактики та діагностики хвороб тварин, а також поради щодо годівлі, виховання та здоров’я вашого улюбленця. Сайт призначений як для ветеринарів, так і для власників тварин, які хочуть покращити якість життя своїх чотирилапих друзів."
        />

        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta
          name="msapplication-config"
          content="/favicon/browserconfig.xml"
        />
        <meta name="theme-color" content="#ffffff" />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vethealth.com.ua" />
        <meta
          property="og:title"
          content={General.SiteTitle}
        />
        <meta
          property="og:description"
          content="Корисні статті про різні аспекти ветеринарної практики та догляду за тваринами. На нашому сайті ви дізнаєтеся про найновіші методи лікування, профілактики та діагностики хвороб тварин, а також поради щодо годівлі, виховання та здоров’я вашого улюбленця. Сайт призначений як для ветеринарів, так і для власників тварин, які хочуть покращити якість життя своїх чотирилапих друзів."
        />
        <meta
          property="og:image"
          content="/social/social.jpg"
        />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://vethealth.com.ua" />
        <meta
          property="twitter:title"
          content={General.SiteTitle}
        />
        <meta
          property="twitter:description"
          content="Корисні статті про різні аспекти ветеринарної практики та догляду за тваринами. На нашому сайті ви дізнаєтеся про найновіші методи лікування, профілактики та діагностики хвороб тварин, а також поради щодо годівлі, виховання та здоров’я вашого улюбленця. Сайт призначений як для ветеринарів, так і для власників тварин, які хочуть покращити якість життя своїх чотирилапих друзів."
        />
        <meta
          property="twitter:image"
          content="/social/social.jpg"
        />
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
