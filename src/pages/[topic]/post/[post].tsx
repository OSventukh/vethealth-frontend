
import Post from "@/components/Posts/Post";
import getData from "@/utils/getData";

export default function PostPage(props) {
  if (!props) {
    return <div>Loading</div>;
  }
  return (
    <section className="content">
      <Post post={props.post} />
    </section>
  );
}

export async function getServerSideProps(context) {
  const { topic, post } = context.params;

  const [postData] = await Promise.all([
    getData(`/posts?slug=${post}`)
  ]);

  console.log('post single', postData)
  // const transformedMenu = transformMenu(navigationMenu);

  return {
    props: {
      post: postData.posts[0] || null,
      general: {
        siteName: 'Vethealth',
        siteDescription: null,
      },
      // navigationMenu: transformedMenu || null,
    },
  };
}
