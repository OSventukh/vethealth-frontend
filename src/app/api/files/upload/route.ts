import { api } from '@/api';
import { auth } from '@/lib/next-auth/auth';
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.token || !request?.body) {
    return Response.error();
  }

  const formData = await request.formData();
  try {
    const response = await fetch('http://localhost:5000/files/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session?.token}`,
      },
      body: formData,
    });
    if (!response.ok) {
      throw new Error();
    }
    const res = await response.json();
    return Response.json(res);
  } catch (error) {
    console.log(error);
  }
  // const response = await api.file.upload(formData, session.token);
  // console.log(response)
  // return Response.json({ path: response.path });
}
