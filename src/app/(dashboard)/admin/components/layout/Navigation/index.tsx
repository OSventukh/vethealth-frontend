'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  FileText,
  Layout,
  Users,
  ListTree,
  LayoutGrid,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import useTooltipSide from '../../../hooks/useTooltipSide';

import { cn } from '@/lib/utils';

type Nav = {
  title: string;
  route: string;
  icon: React.ReactElement;
};

const navs: Nav[] = [
  {
    title: 'Додому',
    route: '/admin',
    icon: <Home size={20} />,
  },
  {
    title: 'Теми',
    route: '/admin/topics',
    icon: <LayoutGrid size={20} />,
  },
  {
    title: 'Категорії',
    route: '/admin/categories',
    icon: <ListTree size={20} />,
  },
  {
    title: 'Cтатті',
    route: '/admin/posts',
    icon: <FileText size={20} />,
  },
  {
    title: 'Сторінки',
    route: '/admin/pages',
    icon: <Layout size={20} />,
  },
  {
    title: 'Користувачі',
    route: '/admin/users',
    icon: <Users size={20} />,
  },
];

export default function Navigation() {
  const tooltipSide = useTooltipSide();
  const pathname = usePathname();
  return (
    <nav className="h-full w-full">
      <ul className="flex h-full w-full items-center md:h-auto md:flex-col">
        {navs.map((item) => (
          <li
            key={item.title}
            className="flex h-full w-full items-center justify-center"
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex h-full w-full items-center justify-center">
                  <Link
                    href={item.route}
                    className={cn(
                      'hover:text-primary flex aspect-square w-[80%] items-center justify-center rounded-xl p-3 transition-all duration-200',
                      pathname === item.route &&
                        'bg-primary text-primary-foreground hover:text-primary-foreground shadow-lg'
                    )}
                  >
                    {item.icon}
                  </Link>
                  <TooltipContent side={tooltipSide}>
                    <p>{item.title}</p>
                  </TooltipContent>
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>
          </li>
        ))}
      </ul>
    </nav>
  );
}
