import Link from 'next/link';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from '@/components/ui/sheet';
import { CategoryResponse } from '@/api/types/categories.type';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

type Props = {
  items: CategoryResponse[];
};

export default function MobileNavigation({ items }: Props) {
  return (
    <>
      <Sheet>
        <SheetTrigger className="sm:hidden">
          <Menu />
          <VisuallyHidden asChild>
            <SheetTitle>Меню</SheetTitle>
          </VisuallyHidden>
        </SheetTrigger>
        <SheetContent side="left">
          <Accordion type="single" collapsible className="mt-4">
            {items.length > 0 &&
              items.map((item) => (
                <AccordionItem value={item.id} key={item.id}>
                  <AccordionTrigger
                    className="text-lg"
                    showArrow={item.children && item.children.length > 0}
                  >
                    <SheetClose asChild>
                      <Link href={`?category=${item.slug}`}>{item.name}</Link>
                    </SheetClose>
                  </AccordionTrigger>
                  {item.children && item.children.length > 0 && (
                    <AccordionContent>
                      <ul className="grid gap-4">
                        {item.children.map((child) => (
                          <li key={child.id}>
                            <SheetClose asChild>
                              <Link href={`?category=${child.slug}`}>
                                {child.name}
                              </Link>
                            </SheetClose>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  )}
                </AccordionItem>
              ))}
          </Accordion>
        </SheetContent>
      </Sheet>
    </>
  );
}
