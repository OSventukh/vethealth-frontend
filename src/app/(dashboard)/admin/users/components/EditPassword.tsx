'use client';
import { useTransition } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  UpdatePasswordValues,
  updatePasswordSchema,
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

import { UserResponse } from '@/api/types/user.type';
import { useToast } from '@/components/ui/use-toast';
import { saveUserAction } from '../actions/save-user.action';

type Props = {
  user: UserResponse;
};

export default function EditUserPassword({ user }: Props) {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const form = useForm<UpdatePasswordValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      email: user.email,
      password: '',
    },
    mode: 'onChange',
  });

  const submitForm = (values: UpdatePasswordValues) => {
    startTransition(async () => {
      const res = await saveUserAction(
        {
          id: user.id,
          password: values.password,
        },
        true
      );
      toast({
        variant: res.error ? 'destructive' : 'success',
        description: res.success ? 'Пароль оновлено' : res.message,
      });
      if (res.success && res.redirect) {
        router.replace(`edit/${res.redirect}`, { scroll: false });
      }
    });
  };
  return (
    <div className="mt-5 w-full rounded-2xl border bg-background p-10">
      <h2>Зміна паролю</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className="grid grid-cols-1 grid-rows-[1fr_min-content] gap-8 sm:w-full lg:w-[50%]"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Email</FormLabel>

                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Пароль</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
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
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Підтвердження паролю</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    placeholder="Введіть прізвище користувача"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>

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
