'use client';

import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu';

import { CategoryResponse } from '@/api/types/categories.type';
import { ChevronRight } from 'lucide-react';

type Props = {
  items: CategoryResponse[];
};
export default function DesktopNavigation({ items }: Props) {
  return (
    <NavigationMenu className="hidden max-h-20 sm:flex">
      <NavigationMenuList className="w-full">
        {items.length > 0 &&
          items.map((item) => (
            <NavigationMenuItem key={item.id} className="relative">
              <Link href={`?category=${item.slug}`}>
                <NavigationMenuTrigger
                  showArrow={item?.children && item.children.length > 0}
                  className="bg-transparent uppercase hover:bg-transparent focus:bg-transparent"
                >
                  {item.name}
                </NavigationMenuTrigger>
              </Link>
              <NavigationMenuContent className="w-full">
                <ul className="grid gap-3 p-2 min-w-[350px] w-max lg:grid-cols-[.75fr_1fr]">
                  {item.children &&
                    item.children.map((child) => (
                      <li key={child.id} className="align-center flex">
                        <Link
                          className="rounded-md p-2 hover:bg-accent text-nowrap "
                          href={`?category=${child.slug}`}
                        >
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
