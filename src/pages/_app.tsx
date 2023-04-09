import '@/styles/globals.css'
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app'
import AdminPanelLayout from '@/components/admin/Layout';
import Theme from '@/theme/themeProvider';
export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const isAdminPanel = router.pathname.startsWith('/admin');
  const authPage = router.pathname.startsWith('/admin/auth');

  if (isAdminPanel && !authPage) {
    return <Theme><AdminPanelLayout><Component {...pageProps} /></AdminPanelLayout></Theme>
  }
  return <Component {...pageProps} />
}
