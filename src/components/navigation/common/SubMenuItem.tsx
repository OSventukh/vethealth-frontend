import Link from 'next/link';
import type { NavItem } from '@/types/props-types';

export default function SubMenuItem({ item, anchor }: NavItem) {
  return (
    <li key={item.id}>
      <Link href={`/${anchor}?category=${item.slug}`}>{item.name}</Link>
    </li>
  );
}
