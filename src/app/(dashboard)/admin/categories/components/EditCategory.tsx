'use client';
import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  CategoryValues,
  createCategorySchema,
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { CategoryResponse } from '@/api/types/categories.type';
import { useToast } from '@/components/ui/use-toast';
import { saveCategoryAction } from '../actions/save-category.action';
import { Info } from 'lucide-react';

type Props = {
  initialData?: CategoryResponse;
  categories: CategoryResponse[];
  editMode?: boolean;
};

export default function EditTopic({
  initialData,
  categories,
  editMode,
}: Props) {
  const router = useRouter();
  const [showParent, setIsShowParent] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();
  const form = useForm<CategoryValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      parent: initialData?.parent,
    },
    mode: 'onChange',
  });

  const submitForm = (values: CategoryValues) => {
    startTransition(async () => {
      const res = await saveCategoryAction(
        { id: initialData?.id, ...values },
        editMode
      );
      toast({
        variant: res.error ? 'destructive' : 'success',
        description: res.success
          ? editMode
            ? 'Категорія оновлена'
            : 'Категорія збережена'
          : res.message,
      });
      if (res.success && res.redirect) {
        router.replace(`edit/${res.redirect}`, { scroll: false });
      }
    });
  };
  return (
    <div className="w-full rounded-2xl border p-10 mt-5 bg-background">
      <h2>{editMode ? 'Редагувати категорію' : 'Створити категорію'}</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className="sm:w-full lg:w-[50%] grid grid-cols-1 grid-rows-[1fr_min-content] gap-8"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Назва</FormLabel>
                <FormControl>
                  <Input placeholder="Введіть назву категорії" {...field} />
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

          {editMode &&
          initialData?.children &&
          initialData.children.length > 0 ? (
            <Alert variant="info">
              <Info className="h-4 w-4" />
              {/* <AlertTitle>Error</AlertTitle> */}
              <AlertDescription>
                Неможна вибрати батьківську категорію, якщо вона має дочірні
              </AlertDescription>
            </Alert>
          ) : (
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
                            {categories.map((item) => (
                              <SelectItem
                                key={item.id}
                                value={item.id.toString()}
                              >
                                {item.name}
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
          )}

          <div className="justify-self-center">
            <Button type="submit" variant="success">
              Зберегти
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
