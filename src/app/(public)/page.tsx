import { api } from '@/api';
import TopicList from './components/topics/TopicList';
import Description from './components/Description';
import Header from './components/Header';
import Footer from './components/Footer';
import { TAGS } from '@/api/constants/tags';
import { Suspense } from 'react';

export default function Home() {
  const topics = api.topics.getMany({
    tags: [TAGS.TOPICS],
  });
  return (
    <>
      <Header />
      <main>
        <div className="container">
          <Description />
          <Suspense>
            <TopicList topics={topics} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
