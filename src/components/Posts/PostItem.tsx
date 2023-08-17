import Link from 'next/link';
import { useRouter } from 'next/router';
import { Raleway } from 'next/font/google';
import type { Post } from '@/types/content-types';
import TrendingFlatRoundedIcon from '@mui/icons-material/TrendingFlatRounded';
import classes from './Post.module.css';

const releway = Raleway({ subsets: ['latin', 'cyrillic'] });

export default function PostItem({ post }: { post: Post }) {
  const router = useRouter();
  const topic = router.query.topic;
  return (
    <article>
      <Link
        className={classes['preview-post']}
        href={`/${post?.topics ? post.topics[0]!.slug : topic}/${post.slug}`}
      >
        <header className={classes['post__header']}>
          <h2 className={`${classes['post__title']} ${releway.className}`}>
            {post.title}
          </h2>
        </header>
        <div
          className={classes['post__content']}
          dangerouslySetInnerHTML={{ __html: post.excerpt }}
        />
        <footer className={classes['post__footer']}>
          <TrendingFlatRoundedIcon />
        </footer>
      </Link>
    </article>
  );
}
