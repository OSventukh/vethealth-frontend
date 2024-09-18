'use client';
import { useRef } from 'react';
import { useFormState } from 'react-dom';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
import { ForgotValues, forgotSchema } from '@/utils/validators/form.validator';
import { AlertCircle } from 'lucide-react';
import AuthCard from './ui/AuthCard';
import { forgotAction } from '../actions/forgot.action';

export default function Forgot() {
  const [formState, formAction] = useFormState(forgotAction, {
    message: '',
    error: false,
    success: false,
  });
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<ForgotValues>({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(forgotSchema),
    mode: 'onChange',
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const backToLoginClickHandler = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('forgotPassword');
    router.push(pathname + '?' + params.toString());
  };

  return (
    <AuthCard title="Відновлення паролю">
      <div className="min-h-14 w-full">
        {formState.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{formState.message}</AlertDescription>
          </Alert>
        )}
        {formState.success && (
          <Alert variant="info">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{formState.message}</AlertDescription>
          </Alert>
        )}
      </div>
      <Form {...form}>
        <form
          ref={formRef}
          className="flex flex-col gap-2 sm:gap-4"
          action={formAction}
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
          <div>
            <Button
              variant="ghost"
              type="button"
              onClick={backToLoginClickHandler}
            >
              Повернутися до логіну
            </Button>
          </div>
          <div className="flex justify-center">
            <Button type="submit">Відновити пароль</Button>
          </div>
        </form>
      </Form>
    </AuthCard>
  );
}
