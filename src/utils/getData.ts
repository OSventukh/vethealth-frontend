
export default async function getData<T>(params: string ): Promise<T> {
 
  const response = await fetch(process.env.NEXT_PUBLIC_API + params);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}
