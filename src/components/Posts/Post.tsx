import ParsedContent from '@/utils/parse-content';
import classes from '@/styles/posts/Post.module.css';

import type { Post } from '@/types/content-types';

export default function Post({post}: { post: Post}) {
  if (!post) {
    return <h2 className='notitification-title'>Стаття відсутня</h2>
  }
  return (
    <article className={classes.post}>
      <h2 className={classes['post__title']}>{post.title}</h2>
      <div className={classes['post__content']}><ParsedContent html={post.content} /></div>
    </article>
  )
}
