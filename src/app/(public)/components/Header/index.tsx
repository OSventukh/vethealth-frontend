import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function Header() {
  return (
    <div className="bg-[rgb(180,239,232)]">
      <div className="container py-8">
        <Link href="/">
          <Image
            src="/logo/vethealth-logo.svg"
            alt="VetHealth"
            width={300}
            height={300}
          />
        </Link>
      </div>
    </div>
  );
}
