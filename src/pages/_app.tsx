import '@/styles/globals.css';
import { useRouter } from 'next/router';
import { useEffect, useContext, useMemo } from 'react';
import type { AppProps } from 'next/app';
import AdminPanelLayout from '@/components/admin/Layout';
import Theme from '@/theme/themeProvider';
import AuthContext, { AuthContextProvider } from '@/context/auth-context';

export default function App({ Component, pageProps }: AppProps) {
  const { isAuth } = useContext(AuthContext);
  const router = useRouter();

  const isAdminPanel = useMemo(() => router.pathname.startsWith('/admin'), [router.pathname]);
  const authPage = useMemo(() => router.pathname.startsWith('/admin/auth'), [router.pathname]);

  useEffect(() => {
    if (isAdminPanel && !authPage && !isAuth) {
      router.push('/admin/auth')
    }
  }, [authPage, isAdminPanel, router, isAuth])

  return (
    <AuthContextProvider>
      {isAuth && isAdminPanel && !authPage ? (
        <Theme>
          <AdminPanelLayout>
            <Component {...pageProps} />
          </AdminPanelLayout>
        </Theme>
      ) : (
        <Component {...pageProps} />
      )}
    </AuthContextProvider>
  );
}
