import Image from 'next/image';
import Link from 'next/link';

import { api } from '@/api';
import DesktopNavigation from '../Navigation/Desktop';
import MobileNavigation from '../Navigation/Mobile';
import SearchBar from '../Navigation/Search';
import Logo from '@/components/logo';

export default async function Header({ topic }: { topic?: string }) {
  const categories = await api.categories.getMany({
    query: { include: 'children', topic },
    tags: ['categories'],
  });

  const isCategories = topic && categories && categories?.count > 0;

  return (
    <header className="max-h-40 bg-[rgb(180,239,232)]">
      <div className="container flex justify-between gap-8 py-8">
        <Link href="/">
          <Logo className='h-16' />
        </Link>
        <div className="flex items-center">
          {isCategories && (
            <DesktopNavigation items={categories?.items || []} />
          )}
          <div className="flex items-center gap-4">
            <SearchBar />
            {isCategories && (
              <MobileNavigation items={categories?.items || []} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
