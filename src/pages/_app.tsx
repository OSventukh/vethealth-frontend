import '@/styles/globals.css';
import { useMemo } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { CssBaseline } from '@mui/material';
import type { AppProps } from 'next/app';
import AdminPanelLayout from '@/components/admin/Layout';
import Layout from '@/components/Layout';
import Theme from '@/theme/themeProvider';
import { SessionProvider } from 'next-auth/react';
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
    <SessionProvider session={session} refetchInterval={10 * 60}>
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
  );
}
