import { ParsedContent } from '@/components/dashboard/Editor/ParsedContent';
import React from 'react';

export default async function Post({ params }: { params: { slug: string } }) {
  const res = await fetch(`${process.env.FRONTEND}/api/posts/${params.slug}`);
  const result = await res.json();
  return (
    <div>
      <h2>{result.title}</h2>
      <div>
        <ParsedContent content={JSON.parse(result.content)} />
      </div>
    </div>
  );
}
