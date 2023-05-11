import '@/styles/globals.css';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
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
  return (
    <AuthContextProvider>
      <Theme>
        {isAdminPanel ? (
          <AdminRouteGuard>
            <CssBaseline />
            <AdminPanelLayout>
              <Component {...pageProps} />
            </AdminPanelLayout>
          </AdminRouteGuard>
        ) : (
          <Component {...pageProps} />
        )}
      </Theme>
    </AuthContextProvider>
  );
}
