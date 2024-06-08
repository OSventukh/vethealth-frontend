'use client';
import { useState, useRef } from 'react';
import { useFormState } from 'react-dom';
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
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ConfirmationValues,
  confirmationSchema,
} from '@/utils/validators/form.validator';
import { AlertCircle, Eye } from 'lucide-react';
import { confirmationAction } from '../actions/confirmation.action';

type Props = {
  token: string;
};
export default function Confirmation({ token }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [formState, formAction] = useFormState(confirmationAction, {
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

  formState.success && router.push('/login');
  
  return (
    <div className="flex h-screen w-full items-center justify-center bg-blue-50">
      <div className="flex h-min w-[90%] overflow-hidden rounded-lg bg-background sm:w-[40rem] md:w-[45rem]">
        <div className="sm-[50%] flex h-full w-full flex-col justify-between p-5">
          <div className="flex w-full flex-col items-center gap-2">
            <Image
              src="/logo/logo.svg"
              alt="logo"
              width={500}
              height={500}
              className="w-12"
            />
            <h1 className="text-xl font-light uppercase">Логін</h1>
          </div>
          <div className="h-14 w-full">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
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
                          {...field}
                        />
                        <Button
                          variant="ghost"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
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
          className="hidden w-[50%] sm:block"
        />
      </div>
    </div>
  );
}
