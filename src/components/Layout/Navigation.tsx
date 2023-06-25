import Link from 'next/link';
import { useRouter } from 'next/router';
import type { Category } from '@/types/content-types';
import classes from '@/styles/layout/Navigation.module.css';

export default function MainNavigation({ data }: { data: Category[] }) {
  const router = useRouter();
  const topic = router.query.topic;

  const subMenuItems = (parentId: number) => {
    const subItems = data.filter((item) => item.parentId === parentId);
    if (subItems.length > 0) {
      return (
        <ul className={classes['main-menu__nested-items']}>
          {subItems.map((subItem) => (
            <li key={subItem.id}>
              <Link href={`/${topic}?category=${subItem.slug}`}>{subItem.name}</Link>
              {subMenuItems(subItem.id)}
            </li>
          ))}
        </ul>
      );
    }
  };

  return (
    <nav className={classes['main-menu']}>
      <ul className={classes['main-menu__main-items']}>
        {data.map((item) => {
          if (item.parentId === null) {
            return (
              <li key={item.id}>
                <Link href={`/${topic}?category=${item.slug}`}>{item.name}</Link>
                {subMenuItems(item.id)}
              </li>
            );
          }
        })}
      </ul>
    </nav>
  );
}
