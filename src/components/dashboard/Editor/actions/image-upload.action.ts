'use server';

import { auth } from '@/lib/next-auth/auth';
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const imageUploadUrl = process.env.IMAGE_UPLOAD_URL!;
export async function imageUploadAction(imageData: FormData) {
  const session = await auth();
  try {
    const response = await fetch(imageUploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session?.token}`,
      },
      body: imageData,
    });
    if (!response.ok) {
      throw new Error();
    }
    return await response.json();
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error?.message : 'Something went wrong',
    };
  }
}
