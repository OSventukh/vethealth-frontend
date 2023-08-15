import { useRouter } from 'next/router';
import NavList from '@/components/navigation/common/NavList';
import type { Category } from '@/types/content-types';

export default function MainNavigation<T>({ data }: { data: Category[] }) {
  const router = useRouter();
  const topic = router.query.topic;

  return (
    <NavList
      items={data}
      anchor={topic as string}
    />
  );
}
