'use client';
import dynamic from 'next/dynamic';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { PanelRightOpen, Save, Settings } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Spinner } from '@/components/ui/spinner';
import { PageStatusEnum } from '../actions/page-status.enum';
import { savePageAction } from '../actions/save-page.action';
import { useToast } from '@/components/ui/use-toast';
import type { PageResponse } from '@/api/types/pages.type';

const Lexical = dynamic(
  () => import('@/app/(dashboard)/admin/components/Editor/Lexical'),
  {
    ssr: false,
  }
);
type Props = {
  initialData?: PageResponse | null;
  editMode?: boolean;
};

export default function EditPage({ initialData, editMode }: Props) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || null);
  const [slug, setSlug] = useState<string>(initialData?.slug || '');

  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const titleChangeHandler = (title: string) => {
    setTitle(title);
  };

  const contentChangeHandler = (content: string) => {
    setContent(content);
  };

  const saveHandler = (status: PageStatusEnum) => {
    startTransition(async () => {
      const res = await savePageAction(
        {
          id: initialData?.id,
          title: title,
          content: content || '',
          slug,
          status: {
            id: status,
          },
        },
        editMode
      );
      toast({
        variant: res.error ? 'destructive' : 'success',
        description: res.success ? 'Сторінка збережена' : res.message,
      });
      if (res.success && res.redirect) {
        router.replace(`edit/${res.redirect}`, { scroll: false });
      }
    });
  };

  const slugChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSlug(value);
  };

  return (
    <Sheet>
      <Lexical
        initialContent={content}
        initialTitle={title}
        onChangeTitle={titleChangeHandler}
        onChangeContent={contentChangeHandler}
      />

      <SheetContent showOverlay={false}>
        <SheetHeader>
          <SheetTitle>Налаштування статті</SheetTitle>
        </SheetHeader>
        <div className="mt-5 flex flex-col gap-5">
          <Button onClick={() => saveHandler(PageStatusEnum.OnReview)}>
            Опублікувати
          </Button>
          <Button onClick={() => saveHandler(PageStatusEnum.Draft)}>
            Зберегти як чернетку
          </Button>

          <div>
            <Label htmlFor="slug">URL адреса</Label>
            <Input id="slug" value={slug} onChange={slugChangeHandler} />
          </div>
        </div>
      </SheetContent>
      <DropdownMenu>
        <DropdownMenuContent className="mb-4 flex flex-col items-center justify-center gap-2 border-none bg-transparent shadow-none">
          <DropdownMenuItem className="focus:bg-transparent" title="Меню">
            <SheetTrigger className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500 p-0 shadow-lg hover:opacity-90">
              <PanelRightOpen />
            </SheetTrigger>
          </DropdownMenuItem>
          <DropdownMenuItem
            title="Зберегти"
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl bg-green-600 p-0 shadow-lg hover:opacity-90 focus:bg-green-600"
            onClick={() => saveHandler(PageStatusEnum.Draft)}
          >
            {<Save />}
          </DropdownMenuItem>
        </DropdownMenuContent>
        <DropdownMenuTrigger className="fixed bottom-20 right-[calc(100vw/7)] flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-slate-400 p-0 opacity-50 shadow-lg transition-all hover:opacity-100 hover:shadow-2xl">
          {isPending ? <Spinner /> : <Settings />}
        </DropdownMenuTrigger>
      </DropdownMenu>
    </Sheet>
  );
}
