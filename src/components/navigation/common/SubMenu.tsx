import NavItem from './NavItem';
import classes from '@/components/navigation/Navigation.module.css';
import type { NavList } from '@/types/props-types';

export default function SubMenu({ items, anchor }: NavList) {
  return (
    <ul className={classes['main-menu__nested-items']}>
      {items.map((item) => <NavItem key={item.id} item={item} anchor={anchor} />)}
    </ul>
  );
}
