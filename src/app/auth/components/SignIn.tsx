'use client';
import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
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
import { LoginValues, loginSchema } from '@/utils/validators/form.validator';
import { AlertCircle, Eye } from 'lucide-react';
import AuthCard from './ui/AuthCard';

export default function SignIn() {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const forgotPasswordClickHandler = () => {
    const params = new URLSearchParams(searchParams);
    params.set('forgotPassword', 'true');
    router.push(pathname + '?' + params.toString());
  };

  const submitForm = async (values: LoginValues) => {
    try {
      const response = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (response && response.status === 401) {
        throw new Error('Невірний пароль або email');
      }
      router.push(searchParams.get('callbackUrl') || '/admin');
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Помилка авторизації');
    }
  };

  return (
    <AuthCard title="Логін">
      <div className="min-h-14 w-full">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className="flex flex-col gap-2 sm:gap-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email:</FormLabel>
                <FormControl>
                  <Input placeholder="Введіть email" {...field} />
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
                      {...field}
                    />
                    <Button
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                      className="absolute right-0 top-0 h-full w-14"
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
          <div>
            <Button
              variant="ghost"
              type="button"
              onClick={forgotPasswordClickHandler}
            >
              Забули пароль?
            </Button>
          </div>
          <div className="flex justify-center">
            <Button type="submit">Увійти</Button>
          </div>
        </form>
      </Form>
    </AuthCard>
  );
}