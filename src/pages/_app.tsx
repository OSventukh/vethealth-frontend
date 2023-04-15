import '@/styles/globals.css';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { CssBaseline } from '@mui/material';
import type { AppProps } from 'next/app';
import AdminPanelLayout from '@/components/admin/Layout';
import Theme from '@/theme/themeProvider';
import AuthContextProvider from '@/providers/auth-provider';
import AdminRouteGuard from '@/providers/admin-route-guard-provider';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const isAdminPanel = useMemo(
    () => router.pathname.startsWith('/admin'),
    [router.pathname]
  );
  const authPage = useMemo(
    () => router.pathname.startsWith('/admin/auth'),
    [router.pathname]
  );

  return (
    <AuthContextProvider>
      <Theme>
        <AdminRouteGuard>
          <CssBaseline />
          {isAdminPanel && !authPage ? (
            <AdminPanelLayout>
              <Component {...pageProps} />
            </AdminPanelLayout>
          ) : (
            <Component {...pageProps} />
          )}
        </AdminRouteGuard>
      </Theme>
    </AuthContextProvider>
  );
}
