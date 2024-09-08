import Image from 'next/image';
import Link from 'next/link';
import DesktopNavigation from '../Navigation/Desktop';
import { api } from '@/api';
import MobileNavigation from '../Navigation/Mobile';

export default async function Header({ topic }: { topic?: string }) {
  const categories = await api.categories.getMany({
    query: { include: 'children', topic },
  });
  
  return (
    <div className="max-h-40 bg-[rgb(180,239,232)]">
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
        {topic && categories &&  (
          <>
            <DesktopNavigation items={categories?.items || []} />

            <MobileNavigation items={categories?.items || []} />
          </>
        )}
      </div>
    </div>
  );
}
