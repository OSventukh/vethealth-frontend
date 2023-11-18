'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
const Lexical = dynamic(() => import('./Lexical'), {
  ssr: false,
});

export default function Editor() {
  const [title, setTitle] = useState<string>();
  const [content, setContent] = useState<string>();

  return (
    <Lexical
      initialTitle={title}
      initialContent={content}
      setTitle={setTitle}
      setContent={setContent}
    />
  );
}
