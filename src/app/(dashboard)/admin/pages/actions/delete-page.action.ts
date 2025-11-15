'use server';
import { revalidateTag } from 'next/cache';

import { auth } from '@/lib/next-auth/auth';
import logger from '@/logger';
import { TAGS } from '@/api/constants/tags';

type ReturnedData = {
  error: boolean;
  success: boolean;
  message: string;
  redirect?: string;
};

export async function deletePageAction(id: string): Promise<ReturnedData> {
  const session = await auth();
  try {
    const response = await fetch(`${process.env.API_SERVER}/pages/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Щось пішло не так');
    }

    revalidateTag(TAGS.PAGES, 'max');
    revalidateTag(TAGS.TOPICS, 'max');

    return {
      success: true,
      error: false,
      message: 'Success',
    };
  } catch (error: unknown) {
    logger.error(
      error instanceof Error ? error.message : JSON.stringify(error)
    );
    const message =
      error instanceof Error ? error.message : 'Щось пішло не так';

    return {
      error: true,
      success: false,
      message,
    };
  }
}
