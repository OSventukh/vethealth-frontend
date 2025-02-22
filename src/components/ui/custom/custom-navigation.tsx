'use client';
import { CategoryResponse } from '@/api/types/categories.type';
import { Card } from '../card';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type Props = {
  items: CategoryResponse[];
};
export default function CustomNavigation({ items }: Props) {
  const params = useParams();
  const { topic } = params;

  return (
    <nav className="group hidden items-center px-4 sm:flex">
      <ul className="flex gap-6">
        {items.length > 0 &&
          items.map((item) => (
            <li
              key={item.id}
              className="relative hover:*:data-[slot=action]:block"
            >
              <Link
                className="flex rounded-lg p-4 uppercase transition hover:bg-slate-100/50"
                href={'/' + topic + '?category=' + item.slug}
              >
                {item.name}
              </Link>
              <ul
                className="absolute hidden pt-3 transition"
                data-slot="action"
              >
                <Card className="overflow-hidden bg-[#defffb]">
                  {item.children &&
                    item.children.map((child) => (
                      <li key={child.id} className="align-center flex w-full">
                        <Link
                          className="w-full p-4 text-nowrap uppercase transition hover:text-blue-400"
                          href={'/' + topic + '?category=' + child.slug}
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                </Card>
              </ul>
            </li>
          ))}
      </ul>
    </nav>
  );
}
