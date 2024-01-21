'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginValues, loginSchema } from '@/utils/validators/form.validator';
import { AlertCircle, Eye } from 'lucide-react';

export default function SignIn() {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });
  const router = useRouter();
  const searchParams = useSearchParams();

  const submitForm = async (values: LoginValues) => {
    try {
      const response = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      console.log(response);
      if (response && response.status === 401) {
        throw new Error('Невірний пароль або email');
      }
      router.push(searchParams.get('callbackUrl') || '/admin');
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Помилка авторизації');
    }
  };
  return (
    <div className="w-full h-screen flex justify-center items-center bg-blue-50">
      <div className="flex w-[90%] sm:w-[40rem] md:w-[45rem] h-min bg-background rounded-lg overflow-hidden">
        <div className="w-full sm-[50%] h-full p-5 flex flex-col justify-between">
          <div className="w-full flex gap-2 items-center flex-col">
            <Image
              src="/logo/logo.svg"
              alt="logo"
              width={500}
              height={500}
              className="w-12"
            />
            <h1 className="text-xl uppercase font-light">Логін</h1>
          </div>
          <div className="w-full h-14">
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
                <Button variant="ghost" type="button">
                  Забули пароль?
                </Button>
              </div>
              <div className="flex justify-center">
                <Button type="submit">Увійти</Button>
              </div>
            </form>
          </Form>
        </div>

        <Image
          src="/images/login_image.svg"
          alt="login image"
          width={1000}
          height={1000}
          style={{ objectFit: 'contain' }}
          className="hidden sm:block w-[50%]"
        />
      </div>
    </div>
  );
}
