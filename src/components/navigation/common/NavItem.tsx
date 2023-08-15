import Link from 'next/link';
import SubMenu from './SubMenu';
import type { NavItem } from '@/types/props-types';

export default function NavItem({ item, anchor }: NavItem) {
  return (
    <li key={item.id}>
      <Link href={`/${anchor}?category=${item.slug}`}>{item.name}</Link>
      {item?.children && <SubMenu items={item.children} anchor={anchor} />}
    </li>
  );
}
