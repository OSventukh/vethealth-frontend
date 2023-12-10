import Link from 'next/link';
import Logo from '@/components/logo';

type Props = {
  className?: string;
};

export default function Header({ className }: Props) {
  return (
    <div className={className}>
      <Link href="/admin">
        <Logo />
      </Link>
    </div>
  );
}
