import Head from 'next/head';
import TopicList from '@/components/admin/Topics/TopicList';
import { General } from '@/utils/constants/general.enum';

export default function TopicsPage() {
  return (
    <>
      <Head>
        <title>{`Topics | ${General.SiteTitle}`}</title>
      </Head>
      <TopicList />;
    </>
  );
}
