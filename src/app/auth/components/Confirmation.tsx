'use client';
import { useState, useRef, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ConfirmationValues,
  confirmationSchema,
} from '@/utils/validators/form.validator';
import { AlertCircle, Eye } from 'lucide-react';
import { confirmationAction } from '../actions/confirmation.action';
import type { PendingUserResponse } from '@/api/types/auth.type';
import AuthCard from './ui/AuthCard';

type Props = {
  token: string;
  user: PendingUserResponse;
};

export default function Confirmation({ user, token }: Props) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const [formState, formAction] = useActionState(confirmationAction, {
    message: '',
    error: false,
    success: false,
  });
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<ConfirmationValues>({
    resolver: zodResolver(confirmationSchema),
    mode: 'onChange',
  });
  const router = useRouter();

  formState.success && router.push('/auth/login');

  return (
    <AuthCard title="Підтвердження паролю">
      <div className="h-14 w-full">
        {formState.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{formState.message}</AlertDescription>
          </Alert>
        )}
      </div>
      <div className="h-14 w-full">
        Привіт, {user?.firstname}! Введіть, будь ласка, пароль для входу на сайт
      </div>
      <Form {...form}>
        <form
          ref={formRef}
          action={formAction}
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit(() => {
              formAction(new FormData(formRef.current!));
            })(event);
          }}
          className="flex flex-col gap-2 sm:gap-4"
        >
          <FormField
            control={form.control}
            name="hash"
            defaultValue={token}
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl>
                  <div className="relative">
                    <Input type="hidden" {...field} />
                  </div>
                </FormControl>
                <div className="h-2">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="email"
            defaultValue={user.email}
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl>
                  <div className="relative">
                    <Input type="email" {...field} autoComplete="email" />
                  </div>
                </FormControl>
                <div className="h-2">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Пароль:</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      className="pr-14"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Введіть пароль"
                      autoComplete="new-password"
                      {...field}
                    />
                    <Button
                      title="Показати пароль"
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                      className="absolute top-0 right-0 h-full w-14"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </FormControl>
                <div className="h-2">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Підтвердіть пароль:</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      className="pr-14"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Введіть пароль"
                      autoComplete="new-password"
                      {...field}
                    />
                    <Button
                      title="Показати пароль"
                      variant="ghost"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      type="button"
                      className="absolute top-0 right-0 h-full w-14"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </FormControl>
                <div className="h-2">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          ></FormField>
          <div className="flex justify-center">
            <Button type="submit">Увійти</Button>
          </div>
        </form>
      </Form>
    </AuthCard>
  );
}
