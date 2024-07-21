import { redirect } from 'next/navigation';
import { api } from '@/api';
import Confirmation from '../components/Confirmation';

type Props = {
  searchParams: {
    hash: string;
  };
};
export default async function ConfirmationPage({ searchParams }: Props) {
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
