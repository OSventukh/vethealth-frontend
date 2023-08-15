import NavItem from './NavItem';
import classes from '@/components/navigation/Navigation.module.css';
import type { NavList } from '@/types/props-types';

export default function NavList({ items, anchor }: NavList) {
  return (
    <nav className={classes['main-menu']}>
      <ul className={classes['main-menu__main-items']}>
        {items.map((item) => (
          <NavItem key={item.id} item={item} anchor={anchor} />
        ))}
      </ul>
    </nav>
  );
}
