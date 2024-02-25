'use client';
import dynamic from 'next/dynamic';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { MultiValue, Options } from 'react-select';
import { PanelRightOpen, Save, Settings } from 'lucide-react';

import { CategoryResponse } from '@/api/types/categories.type';
import { TopicResponse } from '@/api/types/topics.type';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Multiselect from '@/components/ui/multiselect';
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

const Lexical = dynamic(() => import('@/components/dashboard/Editor/Lexical'), {
  ssr: false,
});
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
        variant: res.error ? 'destructive' : 'default',
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
        <div className="flex flex-col gap-5 mt-5">
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
        <DropdownMenuContent className="flex flex-col mb-4 gap-2 justify-center items-center bg-transparent border-none shadow-none">
          <DropdownMenuItem className="focus:bg-transparent" title="Меню">
            <SheetTrigger className="flex justify-center items-center p-0 w-12 h-12 bg-blue-500 hover:opacity-90 rounded-2xl shadow-lg">
              <PanelRightOpen />
            </SheetTrigger>
          </DropdownMenuItem>
          <DropdownMenuItem
            title="Зберегти"
            className="flex justify-center items-center p-0 w-12 h-12 cursor-pointer bg-green-600 hover:opacity-90 focus:bg-green-600 rounded-2xl shadow-lg"
            onClick={() => saveHandler(PageStatusEnum.Draft)}
          >
            {<Save />}
          </DropdownMenuItem>
        </DropdownMenuContent>
        <DropdownMenuTrigger className="fixed flex justify-center items-center overflow-hidden bottom-20 right-[calc(100vw/7)] p-0 w-14 h-14 bg-slate-400 transition-all opacity-50 hover:opacity-100 rounded-2xl shadow-lg hover:shadow-2xl">
          {isPending ? <Spinner /> : <Settings />}
        </DropdownMenuTrigger>
      </DropdownMenu>
    </Sheet>
  );
}
