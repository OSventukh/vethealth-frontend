'use client';
import { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

type Props = {
  src: string;
  alt: string;
};
export default function TopicImage({ src, alt }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 rounded-2xl bg-gray-200" />
      )}
      <Image
        src={src}
        alt={alt}
        width={240}
        height={240}
        className="h-60 w-60 rounded-2xl transition duration-300 ease-in md:hover:scale-110"
        priority
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
