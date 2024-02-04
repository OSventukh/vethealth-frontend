import { api } from '@/api';

export default async function Post({ params }: { params: { slug: string } }) {
  return (
    <div>
      <h2>{params.slug}</h2>
      <div></div>
    </div>
  );
}
