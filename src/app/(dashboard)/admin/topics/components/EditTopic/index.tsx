'use client';
import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  TopicValues,
  createTopicSchema,
} from '@/utils/validators/form.validator';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Combobox } from '@/components/ui/combobox';
import { CategoryResponse } from '@/api/types/categories.type';
import { TopicResponse } from '@/api/types/topics.type';
import ImageUpload from '@/components/ImageUpload';
import { imageUploadAction } from '@/actions/image-upload.action';
import { saveTopicAction } from '../../actions/save-topic.action';
import { useToast } from '@/components/ui/use-toast';

type Props = {
  initialData?: TopicResponse;
  categories: CategoryResponse[];
  topics: TopicResponse[];
  pages?: [];
  editMode?: boolean;
};

export default function EditTopic({
  initialData,
  categories,
  topics,
  editMode,
}: Props) {
  const router = useRouter();
  const [showParent, setIsShowParent] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();
  const form = useForm<TopicValues>({
    resolver: zodResolver(createTopicSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      slug: initialData?.slug || '',
      categories: initialData?.categories,
      status: initialData?.status,
      parent: initialData?.parent,
      contentType: initialData?.contentType || 'post',
      image: initialData?.image,
    },
    mode: 'onChange',
  });

  const submitForm = (values: TopicValues) => {
    startTransition(async () => {
      const res = await saveTopicAction(
        { id: initialData?.id, ...values },
        editMode
      );
      toast({
        variant: res.error ? 'destructive' : 'success',
        description: res.success ? 'Тема збережена' : res.message,
      });
      if (res.success && res.redirect) {
        router.replace(`edit/${res.redirect}`, { scroll: false });
      }
    });
  };
  return (
    <div className="w-full rounded-2xl border p-10 mt-5 bg-background">
      <h2>{editMode ? 'Редагувати тему' : 'Створити тему'}</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className="grid grid-cols-2 grid-rows-[1fr_min-content] gap-8"
        >
          <div className="flex flex-col gap-8 col-start-1 col-end-2 row-start-1 row-end-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Назва</FormLabel>
                  <FormControl>
                    <Input placeholder="Введіть назву теми" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Опис</FormLabel>
                  <FormControl>
                    <Input placeholder="Введіть опис теми" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Url</FormLabel>
                  <FormControl>
                    <Input placeholder="Введіть url теми" {...field} />
                  </FormControl>
                  <FormDescription>
                    Буде відображатися в полі адреси браузера
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Статус</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange({ id: value })}
                      defaultValue={field.value?.id}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Виберіть статус теми" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="1">Активна</SelectItem>
                          <SelectItem value="2">Не активна</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="contentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тип контенту</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Виберіть тип контенту теми" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="post">Список статтей</SelectItem>
                          <SelectItem value="page">Сторінка</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Тип контенту, який буде відображатися при переході на
                    сторінку теми
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="categories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Категорії</FormLabel>
                  <FormControl>
                    <Combobox
                      onChange={field.onChange}
                      options={categories}
                      value={field.value}
                      valueKey="id"
                      labelKey="name"
                    />
                  </FormControl>
                  <FormDescription>
                    Категорії, є пунктами меню для кожної теми
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>

            <FormField
              control={form.control}
              name="parent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between items-center">
                    Батьківська тема
                    <Switch
                      checked={!!initialData?.parent || showParent}
                      onCheckedChange={setIsShowParent}
                    />
                  </FormLabel>

                  {(!!initialData?.parent || showParent) && (
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange({ id: value })}
                        defaultValue={field.value?.id.toString()}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Виберіть тип контенту теми" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="null">Відсутня</SelectItem>
                            {topics.map((item) => (
                              <SelectItem
                                key={item.id}
                                value={item.id.toString()}
                              >
                                {item.title}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  )}
                  <FormDescription>
                    Виберіть тему, для якої нова тема стане дочірньою
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
          </div>
          <div className="col-start-2 col-end-3 row-start-1 row-end-2">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Картинка</FormLabel>
                  <FormControl>
                    <ImageUpload
                      uploadAction={(formData) =>
                        imageUploadAction(formData, 'topic')
                      }
                      width={500}
                      height={500}
                      onImage={(value) =>
                        field.onChange({ id: value?.id, path: value?.path })
                      }
                      value={field.value?.path}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormControl></FormControl>
          </div>
          <div className="justify-self-center col-start-1 col-end-3 row-start-2 row-end-3">
            <Button type="submit" variant="success">
              Зберегти
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
