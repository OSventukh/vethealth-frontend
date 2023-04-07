import '@/styles/globals.css'
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app'
import AdminPanelLayout from '@/components/admin/Layout';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const isAdminPanel = router.pathname.startsWith('/admin');

  if (isAdminPanel) {
    return <AdminPanelLayout><Component {...pageProps} /></AdminPanelLayout>
  }
  return <Component {...pageProps} />
}
