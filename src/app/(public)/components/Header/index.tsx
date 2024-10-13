import Image from 'next/image';
import Link from 'next/link';

import { api } from '@/api';
import DesktopNavigation from '../Navigation/Desktop';
import MobileNavigation from '../Navigation/Mobile';
import SearchBar from '../Navigation/Search';

export default async function Header({ topic }: { topic?: string }) {
  const categories = await api.categories.getMany({
    query: { include: 'children', topic },
    tags: ['categories'],
  });

  return (
    <header className="max-h-40 bg-[rgb(180,239,232)]">
      <div className="container flex justify-between gap-8 py-8">
        <Link href="/">
          <Image
            src="/logo/vethealth-logo.svg"
            alt="VetHealth"
            width={300}
            height={300}
            priority
            className="h-auto"
          />
        </Link>
        {topic && categories && categories?.count > 0 && (
          <div className="flex items-center">
            <DesktopNavigation items={categories?.items || []} />
            <SearchBar />
            <MobileNavigation items={categories?.items || []} />
          </div>
        )}
      </div>
    </header>
  );
}
