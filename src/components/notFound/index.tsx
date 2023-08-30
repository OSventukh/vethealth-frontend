import Image from "next/image";
import { Raleway } from 'next/font/google';
const releway = Raleway({ subsets: ['latin', 'cyrillic'] });
import { General } from '@/utils/constants/general.enum';

export default function NotFound({ text }: { text?: string}) {
  return (
    <>
      <div
        style={{
          width: '100%',
          height: 'calc(20vw + 5rem)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Image
          src="/images/404.svg"
          alt="404"
          fill
          style={{ objectFit: 'contain' }}
        />
      </div>
      <p
        style={{ textAlign: 'center', fontWeight: '600' }}
        className={releway.className}
      >
        {text || General.NotFoundPage.toUpperCase()}
      </p>
    </>
  );
}
