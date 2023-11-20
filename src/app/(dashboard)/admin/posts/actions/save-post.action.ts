'use server';
import { auth } from '@/lib/next-auth/auth';

type Props = {
  title: string;
  content: string;
  status: {
    id: string;
  };
};
export async function savePostAction(data: Props) {
  const session = await auth();

  try {
    const response = await fetch('http://localhost:5000/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.token}`,
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.log(error);
  }
}
