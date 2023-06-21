import '@/styles/globals.css';
import { useMemo } from 'react';
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
    () => router.pathname.startsWith('/auth'),
    [router.pathname]
  );

  return (
    <SessionProvider session={session}>
      <Theme>
        {isAdminPanel ? (
          <>
            <CssBaseline />
            <AdminPanelLayout>
              <Component {...pageProps} />
            </AdminPanelLayout>
          </>
        ) : isAuthPage ? (
          <Component {...pageProps} />
        ) : (
          <Layout general={pageProps.general}>
            <Component {...pageProps} />
          </Layout>
        )}
      </Theme>
    </SessionProvider>
  );
}
