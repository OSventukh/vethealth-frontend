import { CategoryResponse } from '@/api/types/categories.type';
import { Card } from '../card';

type Props = {
  items: CategoryResponse[];
};
export default function CustomNavigation({ items }: Props) {
  return (
    <nav className="group hidden items-center p-4 sm:flex">
      <ul className="flex  gap-6">
        {items.length > 0 &&
          items.map((item) => (
            <li key={item.id} className="relative data-[slot=action]:*:hover:block">
              <a
                className="flex rounded-lg p-4 uppercase transition hover:bg-slate-100 hover:bg-opacity-50 "
                href={'?category=' + item.slug}
              >
                {item.name}
              </a>
              <ul
                className="absolute hidden pt-3 transition"
                data-slot="action"
              >
                <Card className="overflow-hidden bg-[#defffb]">
                  {item.children &&
                    item.children.map((child) => (
                      <li key={child.id} className="align-center flex w-full">
                        <a
                          className="w-full text-nowrap p-4 uppercase transition hover:text-blue-400"
                          href={'?category=' + child.slug}
                        >
                          {child.name}
                        </a>
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
