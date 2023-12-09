import Link from 'next/link';
import { Home, Grid2X2, FileText, List, Layout } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type Nav = {
  title: string;
  route: string;
  icon: JSX.Element;
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
    icon: <Grid2X2 size={20} />,
  },
  {
    title: 'Категорії',
    route: '/admin/categories',
    icon: <List size={20} />,
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
];

export default function Navigation() {
  return (
    <nav className="w-full h-full">
      <ul className="w-full h-full md:h-auto flex md:flex-col items-center">
        {navs.map((item) => (
          <li
            key={item.title}
            className="flex justify-center items-center w-full h-full"
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex justify-center items-center w-full h-full">
                  <Link
                    href={item.route}
                    className="flex justify-center items-center p-3 w-[80%] aspect-square transition-all rounded-xl hover:bg-primary hover:text-primary-foreground hover:shadow-lg"
                  >
                    {item.icon}
                  </Link>
                  <TooltipContent side="right">
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
