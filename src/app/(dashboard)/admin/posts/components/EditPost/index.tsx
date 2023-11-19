'use client';
import { useState, useTransition } from 'react';
import dynamic from 'next/dynamic';
const Lexical = dynamic(() => import('@/components/dashboard/Editor/Lexical'), {
  ssr: false,
});
import { savePostAction } from '../../actions/save-post.action';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

export default function EditPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPending, startTransition] = useTransition();

  const titleChangeHandler = (title: string) => {
    setTitle(title);
  };

  const contentChangeHandler = (content: string) => {
    setContent(content);
  };

  const saveHandler = () => {
    startTransition(async () => {
      const res = await savePostAction({
        title,
        content,
        status: {
          id: '2',
        },
      });
    });
  };
  return (
    <>
      <Lexical
        onChangeTitle={titleChangeHandler}
        onChangeContent={contentChangeHandler}
      />
      <Button className="absolute bottom-20 right-10 md:right-40 p-0 w-14 h-14 bg-green-600 rounded-2xl shadow-lg">
        <Save onClick={saveHandler} />
      </Button>
    </>
  );
}
