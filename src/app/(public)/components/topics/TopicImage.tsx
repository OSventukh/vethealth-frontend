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
        width={200}
        height={200}
        className={clsx(
          'h-[240px] w-[240px] rounded-2xl transition duration-300 ease-in md:hover:scale-110',
          {
            'opacity-0': isLoading,
            'opacity-100': !isLoading,
          }
        )}
        priority
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
