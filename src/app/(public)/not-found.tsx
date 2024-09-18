import Image from 'next/image';
import Header from './components/Header';
import Description from './components/Description';
import Footer from './components/Footer';
import { Metadata } from 'next/types';
import { SITE_DESCRIPTION, SITE_TITLE } from '@/utils/constants/generals';
import Return from '@/components/public/NotFound/Return';

export const metadata: Metadata = {
  title: `Сторінка не знайдена | ${SITE_TITLE}`,
  description: SITE_DESCRIPTION,
};

export default function NotFoundPage() {
  return (
    <>
      <Header />
      <main>
        <div className="container">
          <Description />
          <div className="flex justify-center">
            <Image
              src="/images/404.svg"
              width="500"
              height="400"
              alt="404 image"
            />
          </div>
          <h2 className="mt-4 text-center uppercase text-[rgb(48,100,94)]">
            Сторінка не знайдена
          </h2>
          <div>
            <Return />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
