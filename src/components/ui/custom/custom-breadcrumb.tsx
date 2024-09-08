import Link from 'next/link';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

type Props = {
  prevPages: { href: string; label: string }[];
  currentPage: { label: string };
};

export default function CustomBreadcrumb({ prevPages, currentPage }: Props) {
  return (
    <div className='mt-4 flex lg:justify-center'>
      <Breadcrumb>
        <BreadcrumbList>
          {prevPages.map((item, index) => (
            <BreadcrumbItem key={index}>
              <BreadcrumbLink>
                <Link href={item.href}>{item.label}</Link>
              </BreadcrumbLink>

              <BreadcrumbSeparator />
            </BreadcrumbItem>
          ))}
          <BreadcrumbItem>
            <BreadcrumbPage>{currentPage.label}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
