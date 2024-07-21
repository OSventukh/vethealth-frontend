'use client';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from 'lucide-react';

export default function UserMenu({ userId }: { userId: string | undefined }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarFallback>
            <User size={20} />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Link href={`/admin/users/${userId}`}>
          <DropdownMenuItem>Профіль</DropdownMenuItem>
        </Link>
        <DropdownMenuItem onClick={() => signOut()}>Вихід</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
