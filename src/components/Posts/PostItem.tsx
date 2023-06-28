import Link from 'next/link';
import { useRouter } from 'next/router';
import { Raleway } from 'next/font/google';
import type { Post } from '@/types/content-types';

import classes from '@/styles/posts/Post.module.css';

const releway = Raleway({ subsets: ['latin', 'cyrillic'] });


export default function PostItem({ post }: {post: Post}) {
  const router = useRouter();
  const topic = router.query.topic;

  return (
    <article className={classes['preview-post']}>
      <header className={classes['post__header']}>
        <h2 className={`${classes['post__title']} ${releway.className}`}>
          <Link href={`/${topic}/post/${post.slug}`}>{post.title}</Link>
        </h2>
      </header>
      <div
        className={classes['post__content']}
        dangerouslySetInnerHTML={{ __html: post.excerpt }}
      />
      <div className={classes['post__read-more']}></div>
      <Link className={`${classes.button} ${releway.className}`} href={`/${topic}/post/${post.slug}`}>
        Читати далі
      </Link>
      <footer></footer>
    </article>
  );
}
