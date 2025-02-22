'use client';
import dynamic from 'next/dynamic';
import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { MultiValue, Options } from 'react-select';
import {
  PanelRightClose,
  PanelRightOpen,
  SaveIcon,
  SendIcon,
  ViewIcon,
} from 'lucide-react';

import { CategoryResponse } from '@/api/types/categories.type';
import { PostResponse } from '@/api/types/posts.type';
import { TopicResponse } from '@/api/types/topics.type';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Multiselect from '@/components/ui/multiselect';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Spinner } from '@/components/ui/spinner';
import { PostStatusEnum } from '../../actions/post-status.enum';
import { savePostAction } from '../../actions/save-post.action';
import { useToast } from '@/components/ui/use-toast';
import ImageUpload from '@/components/ImageUpload';
import { imageUploadAction } from '@/actions/image-upload.action';
import type { UserSession } from '@/utils/types/user.type';
import { UserRoleEnum } from '@/utils/enums/user.enum';
import { cn } from '@/lib/utils';

const Lexical = dynamic(
  () => import('@/app/(dashboard)/admin/components/Editor/Lexical'),
  {
    ssr: false,
  }
);

type Props = {
  initialData?: PostResponse | null;
  topics?: TopicResponse[];
  categories?: CategoryResponse[];
  editMode?: boolean;
  user?: UserSession;
};

type FeaturedImageFile = { id: string; path: string } | null | undefined;

const getLabelAndValue = <T,>(
  items: T[] | undefined,
  { valueKey, labelKey }: { valueKey: keyof T; labelKey: keyof T }
): {
  value: string;
  label: string;
}[] => {
  if (!items) return [];
  return items.map((item) => ({
    value: String(item[valueKey]),
    label: String(item[labelKey]),
  }));
};

export default function EditPost({
  initialData,
  topics: topicsOptions,
  categories: categoriesOptions,
  editMode,
  user,
}: Props) {
  const initialTopics = getLabelAndValue<TopicResponse>(initialData?.topics, {
    valueKey: 'id',
    labelKey: 'title',
  });
  const initialCategories = getLabelAndValue<CategoryResponse>(
    initialData?.categories,
    {
      valueKey: 'id',
      labelKey: 'name',
    }
  );
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || null);
  const [slug, setSlug] = useState<string>(initialData?.slug || '');
  const [featuredImageFile, setFeaturedImageFile] = useState<FeaturedImageFile>(
    initialData?.featuredImageFile || null
  );
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string | null>(
    initialData?.featuredImageUrl || null
  );
  const [topics, setTopics] =
    useState<Options<{ label: string; value: string }>>(initialTopics);
  const [categories, setCategories] =
    useState<Options<{ label: string; value: string }>>(initialCategories);
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const titleChangeHandler = (title: string) => {
    setTitle(title);
  };

  const contentChangeHandler = (content: string) => {
    setContent(content);
  };

  const imageUploadHandler = (image: FeaturedImageFile) => {
    setFeaturedImageFile(image);
  };

  const imageUrlChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setFeaturedImageUrl(value);
  };

  const saveHandler = (status: PostStatusEnum) => {
    startTransition(async () => {
      const res = await savePostAction(
        {
          id: initialData?.id,
          title: title,
          content: content || '',
          featuredImageFile: featuredImageFile
            ? { id: featuredImageFile?.id }
            : null,
          featuredImageUrl: featuredImageUrl || null,
          topics: topics.map((item) => ({ id: item.value })),
          categories: categories.map((item) => ({ id: item.value })),
          slug,
          status: {
            id: status,
          },
        },
        editMode
      );
      toast({
        variant: res.error ? 'destructive' : 'success',
        description: res.success ? 'Стаття збережена' : res.message,
      });
      if (res.success && res.redirect) {
        router.replace(`edit/${res.redirect}`, { scroll: false });
      }
    });
  };

  const topicsChangeHandler = (
    selectedOptions: MultiValue<{ label: string; value: string }>
  ) => {
    setTopics(selectedOptions);
  };

  const categoriesChangeHandler = (
    selectedOptions: MultiValue<{ label: string; value: string }>
  ) => {
    setCategories(selectedOptions);
  };

  const slugChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSlug(value);
  };

  return (
    <div
      className={cn(
        'flex w-full justify-center gap-2 md:gap-5',
        isOpenSidebar && 'gap-0 md:gap-5'
      )}
    >
      <Lexical
        initialContent={content}
        initialTitle={title}
        onChangeTitle={titleChangeHandler}
        onChangeContent={contentChangeHandler}
        className={cn('transition-all', isOpenSidebar && 'w-0 md:w-auto')}
      />
      <div
        className={cn(
          'flex-1 rounded-2xl border-[1px] border-border bg-slate-100 p-4 align-middle shadow-xs transition-all',
          isOpenSidebar
            ? 'w-100 md:w-96 md:max-w-96'
            : 'w-12 p-1 md:w-16 md:max-w-16 md:p-2'
        )}
      >
        <div className="flex flex-col gap-5">
          <div className="flex w-full justify-start">
            <Button
              title="Меню"
              className={cn(
                'aspect-square max-w-full',
                !isOpenSidebar && 'p-2'
              )}
              variant="ghost"
              onClick={() => setIsOpenSidebar((state) => !state)}
            >
              {isOpenSidebar ? <PanelRightClose /> : <PanelRightOpen />}
            </Button>
          </div>
          <div className="flex flex-col justify-between gap-2">
            {user?.role.name === UserRoleEnum.Administrator ||
            user?.role.name === UserRoleEnum.SuperAdmininstrator ? (
              <Button
                title="Опублікувати"
                className={cn('gap-2', !isOpenSidebar && 'p-2')}
                onClick={() => saveHandler(PostStatusEnum.Published)}
              >
                <SendIcon /> {isOpenSidebar && <span>Опублікувати</span>}
              </Button>
            ) : (
              <Button
                title="На перегляд"
                className={cn('gap-2', !isOpenSidebar && 'p-2')}
                onClick={() => saveHandler(PostStatusEnum.OnReview)}
              >
                <ViewIcon />
                {isOpenSidebar && <span>На перегляд</span>}
              </Button>
            )}
            <Button
              title="Зберегти як чернетку"
              className={cn('gap-2', !isOpenSidebar && 'p-2')}
              variant="secondary"
              onClick={() => saveHandler(PostStatusEnum.Draft)}
            >
              <SaveIcon /> {isOpenSidebar && <span>Зберегти як чернетку</span>}
            </Button>
          </div>
          {isOpenSidebar && (
            <>
              <div>
                <Label htmlFor="topics">Тема</Label>
                <Multiselect
                  id="topics"
                  isMulti
                  defaultValue={topics}
                  options={getLabelAndValue<TopicResponse>(topicsOptions, {
                    valueKey: 'id',
                    labelKey: 'title',
                  })}
                  onChange={topicsChangeHandler}
                />
              </div>

              <div>
                <Label htmlFor="categories">Категорія</Label>
                <Multiselect
                  id="categories"
                  isMulti
                  defaultValue={categories}
                  options={getLabelAndValue<CategoryResponse>(
                    categoriesOptions,
                    {
                      valueKey: 'id',
                      labelKey: 'name',
                    }
                  )}
                  onChange={categoriesChangeHandler}
                />
              </div>
              <div>
                <Label htmlFor="slug">URL адреса</Label>
                <Input id="slug" value={slug} onChange={slugChangeHandler} />
              </div>
              <div>
                <p>Закріпленна картика</p>
                <Tabs
                  defaultValue={featuredImageFile ? 'upload' : 'url'}
                  className="w-full"
                >
                  <TabsList>
                    <TabsTrigger value="url">Ввести url адресу</TabsTrigger>
                    <TabsTrigger value="upload">Завантажити</TabsTrigger>
                  </TabsList>
                  <TabsContent value="url" className="">
                    <Label htmlFor="imageUrl">URL адреса картинки</Label>
                    <Input
                      id="imageUrl"
                      value={featuredImageUrl || ''}
                      onChange={imageUrlChangeHandler}
                    />
                  </TabsContent>
                  <TabsContent value="upload" className="">
                    <ImageUpload
                      onImage={(image) => imageUploadHandler(image)}
                      value={featuredImageFile?.path || null}
                      width={500}
                      height={500}
                      field="post-featured"
                      uploadAction={imageUploadAction}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
  // return (
  //   <Sheet>
  //     <Lexical
  //       initialContent={content}
  //       initialTitle={title}
  //       onChangeTitle={titleChangeHandler}
  //       onChangeContent={contentChangeHandler}
  //     />

  //     <SheetContent showOverlay={false} className="overflow-y-auto">
  //       <SheetHeader>
  //         <SheetTitle>Налаштування статті</SheetTitle>
  //       </SheetHeader>
  //       <div className="mt-5 flex flex-col gap-5">
  //         <div className="flex justify-between">
  //           {user?.role.name === UserRoleEnum.Administrator ||
  //           user?.role.name === UserRoleEnum.SuperAdmininstrator ? (
  //             <Button onClick={() => saveHandler(PostStatusEnum.Published)}>
  //               Опублікувати
  //             </Button>
  //           ) : (
  //             <Button onClick={() => saveHandler(PostStatusEnum.OnReview)}>
  //               На перегляд
  //             </Button>
  //           )}
  //           <Button onClick={() => saveHandler(PostStatusEnum.Draft)}>
  //             Зберегти як чернетку
  //           </Button>
  //         </div>
  //         <div>
  //           <Label htmlFor="topics">Тема</Label>
  //           <Multiselect
  //             id="topics"
  //             isMulti
  //             defaultValue={topics}
  //             options={getLabelAndValue<TopicResponse>(topicsOptions, {
  //               valueKey: 'id',
  //               labelKey: 'title',
  //             })}
  //             onChange={topicsChangeHandler}
  //           />
  //         </div>
  //         <div>
  //           <Label htmlFor="categories">Категорія</Label>
  //           <Multiselect
  //             id="categories"
  //             isMulti
  //             defaultValue={categories}
  //             options={getLabelAndValue<CategoryResponse>(categoriesOptions, {
  //               valueKey: 'id',
  //               labelKey: 'name',
  //             })}
  //             onChange={categoriesChangeHandler}
  //           />
  //         </div>
  //         <div>
  //           <Label htmlFor="slug">URL адреса</Label>
  //           <Input id="slug" value={slug} onChange={slugChangeHandler} />
  //         </div>
  //         <div>
  //           <p>Закріпленна картика</p>
  //           <Tabs
  //             defaultValue={featuredImageFile ? 'upload' : 'url'}
  //             className="w-full"
  //           >
  //             <TabsList>
  //               <TabsTrigger value="url">Ввести url адресу</TabsTrigger>
  //               <TabsTrigger value="upload">Завантажити</TabsTrigger>
  //             </TabsList>
  //             <TabsContent value="url" className="">
  //               <Label htmlFor="imageUrl">URL адреса картинки</Label>
  //               <Input
  //                 id="imageUrl"
  //                 value={featuredImageUrl || ''}
  //                 onChange={imageUrlChangeHandler}
  //               />
  //             </TabsContent>
  //             <TabsContent value="upload" className="">
  //               <ImageUpload
  //                 onImage={(image) => imageUploadHandler(image)}
  //                 value={featuredImageFile?.path || null}
  //                 width={500}
  //                 height={500}
  //                 field="post-featured"
  //                 uploadAction={imageUploadAction}
  //               />
  //             </TabsContent>
  //           </Tabs>
  //         </div>
  //       </div>
  //     </SheetContent>
  //     <DropdownMenu>
  //       <DropdownMenuContent className="mb-4 flex flex-col items-center justify-center gap-2 border-none bg-transparent shadow-none">
  //         <DropdownMenuItem className="focus:bg-transparent" title="Меню">
  //           <SheetTrigger className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500 p-0 shadow-lg hover:opacity-90">
  //             <PanelRightOpen />
  //           </SheetTrigger>
  //         </DropdownMenuItem>
  //         <DropdownMenuItem
  //           title="Зберегти"
  //           className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl bg-green-600 p-0 shadow-lg hover:opacity-90 focus:bg-green-600"
  //           onClick={() => saveHandler(PostStatusEnum.Draft)}
  //         >
  //           {<Save />}
  //         </DropdownMenuItem>
  //       </DropdownMenuContent>
  //       <DropdownMenuTrigger className="fixed bottom-20 right-[calc(100vw/7)] flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-slate-400 p-0 opacity-50 shadow-lg transition-all hover:opacity-100 hover:shadow-2xl">
  //         {isPending ? <Spinner /> : <Settings />}
  //       </DropdownMenuTrigger>
  //     </DropdownMenu>
  //   </Sheet>
  // );
}
