import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo/vethealth-logo.svg"
      width={300}
      height={200}
      alt="Vethealth"
      className={cn('h-8 w-auto', className)}
      priority
    />
  );
}
