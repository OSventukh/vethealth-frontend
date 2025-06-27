import { Suspense } from 'react';
import Link from 'next/link';
import Logo from '@/components/logo';
import Navigation from '../Navigation';

export default function Header({ topic }: { topic?: string }) {
  return (
    <header className="max-h-40 bg-[rgb(180,239,232)]">
      <div className="container flex justify-between gap-8 py-8">
        <Link href="/">
          <Logo className="h-16" />
        </Link>
        <Suspense>
          <Navigation topic={topic} />
        </Suspense>
      </div>
    </header>
  );
}
