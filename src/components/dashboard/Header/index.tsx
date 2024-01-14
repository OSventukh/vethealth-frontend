import Link from 'next/link';
import Logo from '@/components/logo';
import UserMenu from '@/app/(dashboard)/admin/users/components/UserMenu';

type Props = {
  className?: string;
};

export default function Header({ className }: Props) {
  return (
    <div className={className}>
      <div className="w-full h-full flex justify-between items-center">
        <Link href="/admin">
          <Logo />
        </Link>
        <UserMenu />
      </div>
    </div>
  );
}
