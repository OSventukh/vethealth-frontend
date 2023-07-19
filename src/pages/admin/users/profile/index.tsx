import { useRouter } from 'next/router';
import Head from 'next/head';
import { useGetData } from '@/hooks/data-hook';
import UserProfile from '@/components/admin/User/UserProfile';
import Loading from '@/components/admin/UI/Loading';
import type { User } from '@/types/auth-types';
import { General } from '@/utils/constants/general.enum';

export default function ProfilePage() {
  const router = useRouter();

  const userId = router.query.user;
  const { data, isLoading } = useGetData<{ user: User }>(
    `users?id=${userId}&include=role`
  );

  if (isLoading) {
    return <Loading />;
  }
  return (
    <>
      <Head>
        <title>{`${data?.user.firstname || 'Profile'} | ${General.SiteTitle}`}</title>
      </Head>
      <UserProfile user={data?.user} />
    </>
  );
}
