import React from 'react';
import Link from 'next/link';

import {
  Breadcrumb,
  BreadcrumbItem,
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
    <div className="mt-4 flex lg:justify-center">
      <Breadcrumb>
        <BreadcrumbList>
          {prevPages.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                <Link href={item.href}>{item.label}</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </React.Fragment>
          ))}
          <BreadcrumbItem>
            <BreadcrumbPage>{currentPage.label}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
