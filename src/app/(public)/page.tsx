import { api } from '@/api';
import TopicList from './components/topics/TopicList';
import Description from './components/Description';
import Header from './components/Header';
import Footer from './components/Footer';
import { TAGS } from '@/api/constants/tags';

export default async function Home() {
  const topics = await api.topics.getMany({
    tags: [TAGS.TOPICS],
  });
  return (
    <>
      <Header />
      <main>
        <div className="container">
          <Description />
          <TopicList items={topics?.items || []} />
        </div>
      </main>
      <Footer />
    </>
  );
}
