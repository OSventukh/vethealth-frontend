import Head from 'next/head';
import UserList from '@/components/admin/User/UserList';
import { General } from '@/utils/constants/general.enum';

export default function UsersPage() {
  return (
    <>
      <Head>
        <title>{`Users | ${General.SiteTitle}`}</title>
      </Head>
      <UserList />
    </>
  );
}
