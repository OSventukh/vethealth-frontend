import PostsList from '@/components/Posts/PostList';
import getData from '@/utils/getData';
// import transformMenu from '../../helpers/transform-menu';
import TopicsList from '@/components/Topics/TopicList';
import { Raleway } from 'next/font/google';
const releway = Raleway({ weight: ['600'], subsets: ['latin', 'cyrillic'] });

export default function TopicPage(props) {

  return (
    <>
      <div className="description">
        <h2 className={releway.className}>{props.general.siteDescription}</h2>
      </div>
      {props.subtopics && props.subtopics.length > 0 ? (
        <section className="topics">
          <TopicsList topics={props.subtopics} />
        </section>
      ) : (
        <section className="content">
          <PostsList posts={props.posts} />
        </section>
      )}
    </>
  );
}

export async function getStaticProps(context) {
  const { topic } = context.params;
  try {
    const [data] =
      await Promise.all([
        getData(`/topics/?slug=${topic}&include=children,posts,page`),
       
      ]);
    // const transformedMenu = transformMenu(navigationMenu);

    return {
      props: {
        posts: data?.topic?.posts || null,
        subtopics: data?.topic?.children || null,
        general: {
          siteName: 'Vethealth',
          siteDescription: data?.topic?.description || null,
        },
        // navigationMenu: transformedMenu || null,
      },
      revalidate: 1,
    };
  } catch (error) {
    return {
      props: {
        posts: [],
        subtopics: null,
        general: {
          siteName: null,
          siteDescription: null,
          siteUrl: null
        },
        navigationMenu: null
      }
    }
  }
}

export async function getStaticPaths() {
  const data = await getData('/topics');

  const paths = data.topics.map((item) => ({
    params: { topic: item.slug },
  }));

  return {
    paths: paths,
    fallback: false,
  };
}
