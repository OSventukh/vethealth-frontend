import { Server } from './constants/general.enum';



export default async function getData<T>(params: string ): Promise<T> {
 
  const response = await fetch(Server.Api + params);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}
