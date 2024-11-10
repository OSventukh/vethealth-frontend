'use server';

import { auth } from '@/lib/next-auth/auth';

type ImageUploadReturn = {
  error: boolean;
  message?: string;
  image?: {
    id: string;
    host: string;
    path: string;
    relativePath: string;
  };
};

export const imageUploadAction = async (
  formData: FormData,
  field?: string
): Promise<ImageUploadReturn> => {
  const session = await auth();
  try {
    const response = await fetch(`${process.env.API_SERVER}/files/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session?.token}`,
      },
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error();
    }
    return {
      error: false,
      image: field ? result[field] : result,
    };
  } catch (error: unknown) {
    return {
      error: true,
      message: error instanceof Error ? error.message : 'Щось пішло не так',
    };
  }
};
