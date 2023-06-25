import { useRouter } from 'next/router';
import { useGetData } from '@/hooks/data-hook';
import UserProfile from '@/components/admin/User/UserProfile';
import Loading from '@/components/admin/UI/Loading';

export default function ProfilePage() {
  const router = useRouter();

  const userId = router.query.user;
  const { data, isLoading } = useGetData(`users?id=${userId}&include=role`);

  if (isLoading) {
    return <Loading />;
  }
  return <UserProfile user={{...data?.users[0], role: data.users[0].role.name}} />;
}
