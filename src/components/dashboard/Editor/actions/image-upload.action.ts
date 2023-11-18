'use server';

import { api } from '@/api';
import { auth } from '@/lib/next-auth/auth';

export async function imageUploadAction(imageData: FormData) {
  const session = await auth();
  console.log(session);
  try {
    const response = await api.file.upload(imageData, session?.token || '');
    console.log(response);
    return { message: 'success' };
  } catch (error) {
    console.log(error);
    return {
      message: error instanceof Error ? error.message : 'Something went wrong',
    };
  }
}
