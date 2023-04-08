import '@/styles/globals.css'
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app'
import AdminPanelLayout from '@/components/admin/Layout';
import Theme from '@/theme/themeProvider';
export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const isAdminPanel = router.pathname.startsWith('/admin');

  if (isAdminPanel) {
    return <Theme><AdminPanelLayout><Component {...pageProps} /></AdminPanelLayout></Theme>
  }
  return <Component {...pageProps} />
}
