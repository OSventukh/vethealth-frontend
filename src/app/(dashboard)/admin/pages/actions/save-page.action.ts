'use server';
import { revalidateTag } from 'next/cache';

import { auth } from '@/lib/next-auth/auth';
import { ERROR_MESSAGE } from '@/utils/constants/messages';
import { SERVER_ERROR } from '@/utils/constants/server-error-responses';

type Props = {
  id?: string;
  title: string;
  content: string;
  topics?: { id: string }[] | [];
  categories?: { id: string }[] | [];
  slug?: string;
  status: {
    id: number;
  };
};

type ReturnedData = {
  error: boolean;
  success: boolean;
  message: string;
  redirect?: string;
};

export async function savePageAction(
  data: Props,
  edit?: boolean
): Promise<ReturnedData> {
  const session = await auth();
  try {
    const response = await fetch(`${process.env.API_SERVER}/pages`, {
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
    revalidateTag('admin_pages');

    return {
      success: true,
      redirect: !edit && result.slug,
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
      }
    }

    return {
      error: true,
      success: false,
      message,
    };
  }
}
