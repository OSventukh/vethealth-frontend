import Image from 'next/image';
import Header from './components/Header';
import Description from './components/Description';
import Footer from './components/Footer';
import { Metadata } from 'next/types';
import { SITE_DESCRIPTION, SITE_TITLE } from '@/utils/constants/generals';
import Return from '@/components/public/NotFound/Return';
import NotFound from '@/components/public/NotFound/NotFound';

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
          <NotFound />
        </div>
      </main>
      <Footer />
    </>
  );
}
