'use server';
import { revalidateTag } from 'next/cache';

import { auth } from '@/lib/next-auth/auth';
import { ERROR_MESSAGE } from '@/utils/constants/messages';
import { SERVER_ERROR } from '@/utils/constants/server-error-responses';
import { routes } from '@/api/routes';
import { ConfirmData } from '@/api/types/auth.type';

type ReturnedData = {
  error: boolean;
  success: boolean;
  message: string;
  redirect?: string;
};

export async function confirmationAction(
  state: ReturnedData,
  data: FormData
): Promise<ReturnedData> {
  const session = await auth();
  try {
    const parsedData = Object.fromEntries(data);
    const body = JSON.stringify({
      password: parsedData.password,
      confirmPassword: parsedData.confirmPassword,
      hash: parsedData.hash,
    } as ConfirmData);
    const response = await fetch(routes.confirm, {
      method: 'POST',
      headers: {
        'x-lang': 'ua',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.token}`,
      },

      body,
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    revalidateTag('admin_users');

    return {
      success: true,
      error: false,
      message: 'Success',
    };
  } catch (error: unknown) {
    let message = 'Щось пішло не так';
    if (error instanceof Error) {
      switch (error.message) {
        case SERVER_ERROR.TITLE_MUST_BE_UNIQUE:
          message = ERROR_MESSAGE.TITLE_MUST_BE_UNIQUE;
          break;
        case SERVER_ERROR.TITLE_SHOULD_BE_NOT_EMPTY:
          message = ERROR_MESSAGE.TITLE_SHOULD_BE_NOT_EMPTY;
          break;
        case SERVER_ERROR.SLUG_SHOULD_BE_UNIQUE:
          message = ERROR_MESSAGE.SLUG_SHOULD_BE_UNIQUE;
          break;
      }
    }

    return {
      error: true,
      success: false,
      message,
    };
  }
}
