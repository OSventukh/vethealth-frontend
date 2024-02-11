'use server';
import { revalidateTag } from 'next/cache';

import { auth } from '@/lib/next-auth/auth';
import { ERROR_MESSAGE } from '@/utils/constants/messages';
import { SERVER_ERROR } from '@/utils/constants/server-error-responses';
import { UserValues } from '@/utils/validators/form.validator';

type ReturnedData = {
  error: boolean;
  success: boolean;
  message: string;
  redirect?: string;
};

export async function saveUserAction(
  data: UserValues & { id?: string },
  edit?: boolean
): Promise<ReturnedData> {
  const session = await auth();
  try {
    if (edit) {
      const response = await fetch(`${process.env.API_SERVER}/users`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      revalidateTag('users');

      return {
        success: true,
        error: false,
        message: 'Success',
      };
    } else {
      const response = await fetch(`${process.env.API_SERVER}/auth/register`, {
        method: 'POST',
        headers: {
          'x-lang': 'ua',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      revalidateTag('admin_users');

      return {
        success: true,
        redirect: !edit && result.id,
        error: false,
        message: 'Success',
      };
    }
  } catch (error: unknown) {
    let message = 'Щось пішло не так';
    console.log(error);
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
