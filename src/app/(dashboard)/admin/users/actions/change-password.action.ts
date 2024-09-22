'use server';
import { revalidateTag } from 'next/cache';

import { auth } from '@/lib/next-auth/auth';
import { ERROR_MESSAGE } from '@/utils/constants/messages';
import { SERVER_ERROR } from '@/utils/constants/server-error-responses';
import logger from '@/logger';

type ReturnedData = {
  error: boolean;
  success: boolean;
  message: string;
  redirect?: string;
};

type ChangePasswordActionData = {
  password: string;
  id: string;
};

export async function changePasswordAction(
  data: ChangePasswordActionData & { id?: string }
): Promise<ReturnedData> {
  const session = await auth();
  try {
    const response = await fetch(
      `${process.env.API_SERVER}/auth/change-password`,
      {
        method: 'PATCH',
        headers: {
          'x-lang': 'ua',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message);
    }

    revalidateTag('users');

    return {
      success: true,
      error: false,
      message: 'Success',
    };
  } catch (error: unknown) {
    let message = 'Щось пішло не так';
    logger.error(
      error instanceof Error ? error.message : JSON.stringify(error)
    );
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
