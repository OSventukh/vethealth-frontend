'use client';

import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu';

import { CategoryResponse } from '@/api/types/categories.type';
import { api } from '@/api';
import { Params } from '@/app/(public)/types/params.type';

type Props = {
  items: CategoryResponse[];
};
export default function DesktopNavigation({ items }: Props) {
  return (
    <NavigationMenu className='max-h-20 hidden sm:flex'>
      <NavigationMenuList>
        {items.length > 0 &&
          items.map((item) => (
            <NavigationMenuItem key={item.id} >
              <Link href={`?category=${item.slug}`}>
                <NavigationMenuTrigger
                  showArrow={item?.children && item.children.length > 0}
                  className="bg-transparent hover:bg-transparent focus:bg-transparent uppercase"
                >
                  {item.name}
                </NavigationMenuTrigger>
              </Link>
              <NavigationMenuContent>
                <ul className="grid min-w-max">
                  {item.children &&
                    item.children.map((child) => (
                      <li key={child.id} className="p-4">
                        <Link href={`?category=${child.slug}`}>
                          {child.name}
                        </Link>
                      </li>
                    ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
