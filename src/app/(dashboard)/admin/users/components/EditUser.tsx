'use client';
import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  UserValues,
  createUserSchema,
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

import { UserResponse } from '@/api/types/user.type';
import { TopicResponse } from '@/api/types/topics.type';
import { useToast } from '@/components/ui/use-toast';
import { saveUserAction } from '../actions/save-user.action';
import { Combobox } from '@/components/ui/combobox';

type Props = {
  initialData?: UserResponse;
  topics: TopicResponse[];
  editMode?: boolean;
};

export default function EditTopic({ initialData, topics, editMode }: Props) {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();
  const form = useForm<UserValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstname: initialData?.firstname,
      lastname: initialData?.lastname || '',
      email: initialData?.email || '',
      role: initialData?.role || { id: '4' },
      status: initialData?.status
        ? { id: initialData?.status.id.toString() }
        : null,
      topics: initialData?.topics,
    },
    mode: 'onChange',
  });

  const submitForm = (values: UserValues) => {
    startTransition(async () => {
      const res = await saveUserAction(
        {
          ...(editMode && { id: initialData?.id }),
          firstname: values.firstname,
          lastname: values.lastname,
          email: values.email,
          ...(initialData?.role.id !== '1' && { role: values.role }),
          ...(editMode &&
            initialData?.role.id !== '1' && { status: values.status }),
          topics: values.topics,
        },
        editMode
      );
      toast({
        variant: res.error ? 'destructive' : 'success',
        description: res.success
          ? editMode
            ? 'Користувача оновлена'
            : 'Користувача cтворено, на його емейл надійде лист з підтвердженням'
          : res.message,
      });
      if (res.success && res.redirect) {
        router.replace(`edit/${res.redirect}`, { scroll: false });
      }
    });
  };
  return (
    <div className="w-full rounded-2xl border p-10 mt-5 bg-background">
      <h2>{editMode ? 'Редагувати користувача' : 'Створити користувача'}</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className="sm:w-full lg:w-[50%] grid grid-cols-1 grid-rows-[1fr_min-content] gap-8"
        >
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ім&apos;я</FormLabel>
                <FormControl>
                  <Input placeholder="Введіть ім'я користувача" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>

          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Прізвище</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Введіть прізвище користувача"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Введіть email користувача" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          {initialData?.role.id !== '1' && (
            <>
              {editMode && (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex justify-between items-center">
                        Статус
                      </FormLabel>

                      <FormControl>
                        <Select
                          onValueChange={(value) =>
                            field.onChange({ id: value })
                          }
                          defaultValue={field.value?.id?.toString()}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Виберіть статус користувача" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="1">Активний</SelectItem>
                              <SelectItem value="3">Заблокований</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
              )}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex justify-between items-center">
                      Роль
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange({ id: value })}
                        defaultValue={field.value?.id.toString()}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Виберіть статус користувача" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="2">Адміністратор</SelectItem>
                            <SelectItem value="3">Модератор</SelectItem>
                            <SelectItem value="4">Користувач</SelectItem>
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
                name="topics"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Теми</FormLabel>
                    <FormControl>
                      <Combobox
                        onChange={field.onChange}
                        options={topics}
                        value={field.value}
                        valueKey="id"
                        labelKey="title"
                      />
                    </FormControl>
                    <FormDescription>
                      Теми, в яких користувач зможе писати статті
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </>
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
