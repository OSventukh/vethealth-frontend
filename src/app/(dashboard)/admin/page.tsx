import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@/components/dashboard/Editor/Lexical'), {
  ssr: false,
});

export default async function AdminPage() {
  return <Editor />;
}
