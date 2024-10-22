'use server';
import { revalidateTag } from 'next/cache';

import { auth } from '@/lib/next-auth/auth';
import { ERROR_MESSAGE } from '@/utils/constants/messages';
import { SERVER_ERROR } from '@/utils/constants/server-error-responses';
import { CategoryValues } from '@/utils/validators/form.validator';
import logger from '@/logger';
import { TAGS } from '@/api/constants/tags';

type ReturnedData = {
  error: boolean;
  success: boolean;
  message: string;
  redirect?: string;
};

export async function saveCategoryAction(
  data: CategoryValues & { id?: string },
  edit?: boolean
): Promise<ReturnedData> {
  const session = await auth();
  try {
    const response = await fetch(`${process.env.API_SERVER}/categories`, {
      method: edit ? 'PATCH' : 'POST',
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

    revalidateTag(TAGS.CATEGORIES);
    revalidateTag(TAGS.TOPICS);


    return {
      success: true,
      redirect: !edit && result.slug,
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
