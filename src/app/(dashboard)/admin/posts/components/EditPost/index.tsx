'use client';
import dynamic from 'next/dynamic';
import { useState, useTransition } from 'react';
import { MultiValue } from 'react-select';
import { PanelRightOpen, Save, Settings } from 'lucide-react';

import { CategoryResponse } from '@/api/types/categories.type';
import { PostResponse } from '@/api/types/posts.type';
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
import { PostStatusEnum } from '../../actions/post-status.enum';
import { savePostAction } from '../../actions/save-post.action';
import { useToast } from '@/components/ui/use-toast';

const Lexical = dynamic(() => import('@/components/dashboard/Editor/Lexical'), {
  ssr: false,
});
type Props = {
  initialData?: PostResponse;
  topics?: TopicResponse[];
  categories?: CategoryResponse[];
};

export default function EditPost({
  initialData,
  topics: topicsOptions,
  categories: categoriesOptions,
}: Props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [slug, setSlug] = useState<string>('');
  const [topics, setTopics] = useState<{ id: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string }[]>([]);

  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const titleChangeHandler = (title: string) => {
    setTitle(title);
  };

  const contentChangeHandler = (content: string) => {
    setContent(content);
  };

  const saveHandler = (status: PostStatusEnum) => {
    startTransition(async () => {
      const res = await savePostAction({
        title,
        content,
        topics,
        categories,
        status: {
          id: status,
        },
      });

      toast({
        variant: res.error ? 'destructive' : 'default',
        description: res.success ? 'Стаття збережена' : res.message,
      });
    });
  };

  const topicsChangeHandler = (
    selectedOptions: MultiValue<{ label: string; value: string }>
  ) => {
    const topicsIds = selectedOptions.map((topic) => ({ id: topic.value }));
    setTopics(topicsIds);
  };

  const categoriesChangeHandler = (
    selectedOptions: MultiValue<{ label: string; value: string }>
  ) => {
    const topicsIds = selectedOptions.map((category) => ({
      id: category.value,
    }));
    setCategories(topicsIds);
  };

  const slugChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSlug(value);
  };

  return (
    <Sheet>
      <Lexical
        initialContent={initialData?.content}
        initialTitle={initialData?.title}
        onChangeTitle={titleChangeHandler}
        onChangeContent={contentChangeHandler}
      />

      <SheetContent showOverlay={false}>
        <SheetHeader>
          <SheetTitle>Налаштування статті</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-5 mt-5">
          <Button onClick={() => saveHandler(PostStatusEnum.OnReview)}>
            Опублікувати
          </Button>
          <div>
            <Label htmlFor="topics">Тема</Label>
            <Multiselect
              id="topics"
              isMulti
              defaultValue={initialData?.topics?.map((topic) => ({
                value: topic.id,
                label: topic.title,
              }))}
              options={topicsOptions?.map((topic) => ({
                label: topic.title,
                value: topic.id,
              }))}
              onChange={topicsChangeHandler}
            />
          </div>
          <div>
            <Label htmlFor="categories">Категорія</Label>
            <Multiselect
              id="categories"
              isMulti
              defaultValue={initialData?.categories?.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
              options={categoriesOptions?.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
              onChange={categoriesChangeHandler}
            />
          </div>
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
            onClick={() => saveHandler(PostStatusEnum.Draft)}
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
