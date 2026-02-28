import Image from 'next/image';

type Props = {
  src: string;
  alt: string;
  priority?: boolean;
};
export default function TopicImage({ src, alt, priority = false }: Props) {
  return (
    <div className="relative h-60 w-60 overflow-hidden rounded-2xl bg-gray-200 transition duration-300 ease-in md:hover:scale-110">
      <Image
        src={src}
        alt={alt}
        width={240}
        height={240}
        className="w-full h-full object-cover"
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        sizes="(max-width: 768px) 240px, 240px"
        quality={70}
      />
    </div>
  );
}
