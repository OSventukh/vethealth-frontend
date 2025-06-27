import { api } from '@/api';
import DesktopNavigation from './Desktop';
import MobileNavigation from './Mobile';
import SearchBar from './Search';

export default async function Navigation({ topic }: { topic?: string }) {
  const categories = await api.categories.getMany({
    query: { include: 'children', topic },
    tags: ['categories'],
  });

  const isCategories = topic && categories && categories?.count > 0;

  return (
    <div className="flex items-center">
      {isCategories && <DesktopNavigation items={categories?.items || []} />}
      <div className="flex items-center gap-4">
        <SearchBar />
        {isCategories && <MobileNavigation items={categories?.items || []} />}
      </div>
    </div>
  );
}
