import Image from 'next/image';
import Return from './Return';

type Props = {
  text?: string;
};

const FALLBACK_TEXT = 'Сторінка не знайдена';

export default function NotFound({ text = FALLBACK_TEXT }: Props) {
  return (
    <div className="flex flex-col justify-center">
      <div className="flex justify-center">
        <Image src="/images/404.svg" width="500" height="400" alt="404 image" />
      </div>
      <h2 className="mt-4 text-center text-xl text-[rgb(48,100,94)] uppercase">
        {text}
      </h2>
      <div>
        <Return />
      </div>
    </div>
  );
}
