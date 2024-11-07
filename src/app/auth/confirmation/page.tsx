import { redirect } from 'next/navigation';
import { api } from '@/api';
import Confirmation from '../components/Confirmation';

type Props = {
  searchParams: Promise<{
    hash: string;
  }>;
};
export default async function ConfirmationPage(props: Props) {
  const searchParams = await props.searchParams;
  const { hash } = searchParams;
  try {
    const user = await api.auth.getPendingUser(hash);
    if (!user) {
      redirect('/auth/login');
    }
    return <Confirmation user={user} token={hash} />;
  } catch (error: unknown) {
    redirect('/auth/login');
  }
}
