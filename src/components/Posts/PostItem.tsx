import Link from 'next/link';
import { useRouter } from 'next/router';
import { Raleway } from 'next/font/google';
import type { Post } from '@/types/content-types';
import { Button } from '@mui/material';
import TrendingFlatRoundedIcon from '@mui/icons-material/TrendingFlatRounded';
import classes from '@/styles/posts/Post.module.css';

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
        <footer>
        {/* <Button
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
          </Button> */}
          <TrendingFlatRoundedIcon />
        </footer>
      </Link>
    </article>
  );
}
