import Link from 'next/link';
import { useRouter } from 'next/router';
import { Raleway } from 'next/font/google';
import type { Post } from '@/types/content-types';
import { Button } from '@mui/material';
import classes from '@/styles/posts/Post.module.css';

const releway = Raleway({ subsets: ['latin', 'cyrillic'] });

export default function PostItem({ post }: { post: Post }) {
  const router = useRouter();
  const topic = router.query.topic;
  return (
    <article className={classes['preview-post']}>
      <header className={classes['post__header']}>
        <h2 className={`${classes['post__title']} ${releway.className}`}>
          <Link
            href={`/${post?.topics ? post.topics[0]!.slug : topic}/${
              post.slug
            }`}
          >
            {post.title}
          </Link>
        </h2>
      </header>
      <div
        className={classes['post__content']}
        dangerouslySetInnerHTML={{ __html: post.excerpt }}
      />
      {/* <footer>
        <Button
          size="small"
          LinkComponent={Link}
          href={`/${post?.topics ? post.topics[0]!.slug : topic}/${post.slug}`}
          variant="contained"
          sx={{
            background: 'var(--main-theme-color)',
            color: 'var(--font-color)',
            boxShadow: 'none',
            '&:hover': {
              background: 'var(--main-theme-color)',
            },
          }}
        >
          Читати далі
        </Button>
      </footer> */}
    </article>
  );
}
